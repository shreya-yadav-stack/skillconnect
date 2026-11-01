const crypto = require('crypto');
require('dotenv').config();
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken')
const pool = require('./db');
const express = require('express');
const cors = require('cors');
const transporter =require('./email')
const nodemailer = require('nodemailer')
const authMiddleware = require('./middleware/authMiddleware');
const adminMiddleware = require('./middleware/adminMiddleware');
const {OAuth2Client} = require('google-auth-library');
const multer = require('multer');
const { uploadToStorj, getFromStorj } = require('./services/storj');


const profileImageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, callback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!allowedTypes.includes(file.mimetype)) {
      return callback(
        new Error('Only JPEG, PNG, and WebP images are allowed.'),
      );
    }

    callback(null, true);
  },
});
const googleClient = new OAuth2Client();
const app = express();
const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com';
// Fixed test rate for PayPal Sandbox only.
// Example: 1 USD = 85 INR. Replace with a suitable test rate if needed.
const INR_PER_USD = Number(process.env.INR_PER_USD || 85);
const getPayPalAccessToken = async () => {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials are not configured');
  }

  const response = await axios.post(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: {
        username: clientId,
        password: clientSecret,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  return response.data.access_token;
};
const cron = require('node-cron');

app.use(cors());
app.use(express.json());
// OpenStreetMap address search using Nominatim
// Address search using Photon (OpenStreetMap)
app.get('/api/places/search', authMiddleware, async (req, res) => {
  try {
    const query = req.query.query?.trim();

    if (!query || query.length < 3) {
      return res.status(400).json({
        message: 'Please enter at least 3 characters.',
      });
    }

    const response = await axios.get(
      'https://photon.komoot.io/api/',
      {
        params: {
          q: query,
          limit: 20,
          countrycode: 'IN',
          dedupe: 0,
        },
        timeout: 15000,
      },
    );

    const results = (response.data.features || []).map(feature => {
      const place = feature.properties || {};
      const coordinates = feature.geometry?.coordinates || [];

      return {
        display_name: [
          place.name,
          place.street,
          place.city || place.district,
          place.state,
          place.country,
          place.postcode,
        ]
          .filter(Boolean)
          .filter((value, index, values) => values.indexOf(value) === index)
          .join(', '),

        latitude: Number(coordinates[1]),
        longitude: Number(coordinates[0]),

        address: {
          city: place.city || place.district || '',
          state: place.state || '',
          country: place.country || '',
          postal_code: place.postcode || '',
        },
      };
    }).filter(place =>
      Number.isFinite(place.latitude) &&
      Number.isFinite(place.longitude),
    );

    return res.json({results});
  } catch (error) {
    console.error(
      'PHOTON SEARCH ERROR:',
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message: 'Unable to search addresses.',
    });
  }
});
// Reverse geocoding using Nominatim (OpenStreetMap)
app.get('/api/places/reverse', authMiddleware, async (req, res) => {
  try {
    const latitude = Number(req.query.latitude);
    const longitude = Number(req.query.longitude);

    if (
      !Number.isFinite(latitude) ||
      !Number.isFinite(longitude) ||
      latitude < -90 ||
      latitude > 90 ||
      longitude < -180 ||
      longitude > 180
    ) {
      return res.status(400).json({
        message: 'Valid latitude and longitude are required.',
      });
    }

    const response = await axios.get(
      'https://nominatim.openstreetmap.org/reverse',
      {
        params: {
          lat: latitude,
          lon: longitude,
          format: 'jsonv2',
          addressdetails: 1,
        },
        headers: {
          'User-Agent': 'SkillConnect/1.0',
        },
        timeout: 15000,
      },
    );

    const place = response.data;
    const address = place.address || {};

    return res.json({
      result: {
        display_name: place.display_name || '',
        latitude,
        longitude,
        address: {
          city:
            address.city ||
            address.town ||
            address.village ||
            address.municipality ||
            address.county ||
            '',
          state: address.state || '',
          country: address.country || '',
          postal_code: address.postcode || '',
        },
      },
    });
  } catch (error) {
    console.error(
      'REVERSE GEOCODING ERROR:',
      error.response?.data || error.message,
    );

    return res.status(500).json({
      message: 'Unable to find address for these coordinates.',
    });
  }
});
console.log('Membership expiry cron job scheduled.');
pool.query(
  `SELECT current_database() AS database,
          current_user AS user,
          inet_server_addr() AS server,
          inet_server_port() AS port`,
  (error, result) => {
    if (error) {
      console.error('DATABASE CHECK ERROR:', error);
      return;
    }

    console.log('DATABASE CONNECTION:', result.rows[0]);
  },
);

pool.query('SELECT NOW()', (error, result) => {
    if (error) {
      console.error('DATABASE CONNECTION ERROR:', error);
    } else {
      console.log('DATABASE CONNECTED:', result.rows[0]);
    }
  });

app.get('/', (req, res) => {
  res.json({
    message: 'SkillConnect backend is running',
  });
});

app.post('/api/auth/signup', async (req, res) => {
    const {name, email, password} = req.body;

    try {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1',
        [email],
      );

      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          message: 'Email already registered',
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const verificationToken = crypto.randomBytes(32).toString('hex');

      const verificationTokenExpiresAt = new Date(Date.now()+ 60*60*1000);


      const result = await pool.query(
        `INSERT INTO users (name, email, password, verification_Token, verification_token_expires_at)
         VALUES ($1, $2, $3, $4,$5)
         RETURNING id, name, email, is_email_verified, role, created_at`,
        [name, email, hashedPassword, verificationToken, verificationTokenExpiresAt],
      );


      const verificationUrl = `https://bullhorn-stapling-stapling.ngrok-free.dev/api/auth/verify-email?token=${verificationToken}`;

      const info = await transporter.sendMail({
        from: `"SkillConnect" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify your SkillConnect email',

        text: `Welcome to SkillConnect!

      Please verify your email by clicking this link:

      ${verificationUrl}

      This link will expire in 1 hour.`,

        html: `
          <h2>Welcome to SkillConnect!</h2>

          <p>Please verify your email address by clicking the button below:</p>

          <p>
            <a href="${verificationUrl}">
              Verify My Email
            </a>
          </p>

          <p>This link will expire in 1 hour.</p>
        `,
      });
      console.log('VERIFICATION EMAIL SENT:', info.messageId);
console.log('PREVIEW URL:', nodemailer.getTestMessageUrl(info));

      res.status(201).json({
        message: 'Signup successful',
        user: result.rows[0],
      });
    } catch (error) {
      console.error('SIGNUP DATABASE ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });


  app.get('/api/auth/verify-email', async (req, res) => {
    const { token } = req.query;

    const renderPage = (title, message, success) => {
      const accent = success ? '#16a34a' : '#dc2626';
      const symbol = success ? '✓' : '!';
      const safeTitle = title.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      const safeMessage = message.replace(/&/g, '&amp;').replace(/</g, '&lt;');

      return res.status(success ? 200 : 400).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#f8fafc" />
  <title>${safeTitle} | SkillConnect</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0; min-height: 100vh; padding: 24px;
      display: flex; align-items: center; justify-content: center;
      background: #f1f5f9;
      font-family: Arial, Helvetica, sans-serif; color: #0f172a;
    }
    .card {
      width: 100%; max-width: 430px; padding: 40px 28px;
      background: white; border: 1px solid #e2e8f0;
      border-radius: 22px; text-align: center;
      box-shadow: 0 18px 50px rgba(15, 23, 42, .08);
    }
    .logo { font-size: 22px; font-weight: 800; margin-bottom: 30px; }
    .logo span { color: #2563eb; }
    .icon {
      width: 76px; height: 76px; margin: 0 auto 24px;
      display: flex; align-items: center; justify-content: center;
      border-radius: 50%; background: ${success ? '#dcfce7' : '#fee2e2'};
      color: ${accent}; font-size: 42px; font-weight: bold;
    }
    h1 { font-size: 25px; line-height: 1.3; margin: 0 0 14px; }
    p { color: #64748b; font-size: 15px; line-height: 1.7; margin: 0 0 26px; }
    .button {
      display: block; padding: 15px 18px; border-radius: 11px;
      background: #2563eb; color: white; text-decoration: none;
      font-weight: 700; font-size: 15px;
    }
    .footer { margin-top: 25px; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <main class="card">
    <div class="logo">Skill<span>Connect</span></div>
    <div class="icon">${symbol}</div>
    <h1>${safeTitle}</h1>
    <p>${safeMessage}</p>
    ${success
      ? '<a class="button" href="skillconnect://">Continue to SkillConnect</a>'
      : ''}
    <div class="footer">SkillConnect · Account Security</div>
  </main>
</body>
</html>`);
    };

    if (!token || typeof token !== 'string') {
      return renderPage(
        'Verification Link Invalid',
        'This verification link is missing or invalid. Please request a new verification email.',
        false,
      );
    }

    try {
      const result = await pool.query(
        `SELECT id, email, verification_token_expires_at, is_email_verified
         FROM users
         WHERE verification_token = $1`,
        [token],
      );

      if (result.rows.length === 0) {
        return renderPage(
          'Link Invalid or Already Used',
          'This verification link is invalid or has already been used. If your email is already verified, you can sign in.',
          false,
        );
      }

      const user = result.rows[0];

      if (new Date() > new Date(user.verification_token_expires_at)) {
        return renderPage(
          'Verification Link Expired',
          'This link has expired. Please request a new verification email.',
          false,
        );
      }

      await pool.query(
        `UPDATE users
         SET is_email_verified = TRUE,
             verification_token = NULL,
             verification_token_expires_at = NULL
         WHERE id = $1`,
        [user.id],
      );

      return renderPage(
        'Email Verified Successfully!',
        'Your email address has been verified. Your SkillConnect account is ready to use.',
        true,
      );
    } catch (error) {
      console.error('EMAIL VERIFICATION ERROR:', error);
      return res.status(500).send(
        '<!DOCTYPE html><html lang="en"><meta name="viewport" content="width=device-width, initial-scale=1"><title>SkillConnect Error</title><body style="font-family:Arial,sans-serif;text-align:center;padding:50px"><h1>Something went wrong</h1><p>Please try again later.</p></body></html>',
      );
    }
  });

  app.post('/api/auth/forgot-password', async (req, res) => {
    const {email} = req.body;

    try {
      const result = await pool.query(
        `SELECT id, email
         FROM users
         WHERE email = $1`,
        [email],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'No account found with this email',
        });
      }

      const user = result.rows[0];

      const resetToken = crypto.randomBytes(32).toString('hex');

      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      await pool.query(
        `UPDATE users
         SET reset_password_token = $1,
             reset_password_token_expires_at = $2
         WHERE id = $3`,
        [resetToken, expiresAt, user.id],
      );

      const resetLink =
        `  https://bullhorn-stapling-stapling.ngrok-free.dev/api/auth/reset-password?token=${resetToken}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Reset your SkillConnect password',
        html: `
          <h2>Reset your password</h2>

          <p>You requested to reset your SkillConnect password.</p>

          <p>
            Click the link below to reset your password:
          </p>

          <a href="${resetLink}">
            Reset Password
          </a>

          <p>This link will expire in 1 hour.</p>
        `,
      });

      res.json({
        message: 'Password reset email sent',
      });
    } catch (error) {
      console.error('FORGOT PASSWORD ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });

  app.get('/api/auth/reset-password', async (req, res) => {
    const {token} = req.query;

    if (!token) {
      return res.status(400).send('Reset token is missing');
    }

    try {
      const result = await pool.query(
        `SELECT id
         FROM users
         WHERE reset_password_token = $1
         AND reset_password_token_expires_at > NOW()`,
        [token],
      );

      if (result.rows.length === 0) {
        return res.status(400).send('Invalid or expired reset token');
      }

      res.send(`
        <h2>Reset Password</h2>

        <p>Your reset link is valid.</p>

        <p>Token:</p>

        <p>${token}</p>

        <p>Next we will connect this page to the SkillConnect mobile reset-password screen.</p>
      `);
    } catch (error) {
      console.error('RESET TOKEN ERROR:', error);

      res.status(500).send('Something went wrong');
    }
  });

  app.post('/api/auth/reset-password', async (req, res) => {
    const {token, newPassword} = req.body;

    try {
      const result = await pool.query(
        `SELECT
          id,
          email,
          reset_password_token,
          reset_password_token_expires_at,
          NOW() AS current_time
         FROM users
         WHERE reset_password_token = $1`,
        [token],
      );

      console.log('RESET TOKEN DB RESULT:', result.rows);

      if (result.rows.length === 0) {
        return res.status(400).json({
          message: 'Token does not match database',
        });
      }

      const user = result.rows[0];

      console.log('TOKEN EXPIRY:', user.reset_password_token_expires_at);
      console.log('CURRENT TIME:', user.current_time);

      if (
        user.reset_password_token_expires_at <=
        user.current_time
      ) {
        return res.status(400).json({
          message: 'Reset token has expired',
        });
      }

      if (!newPassword) {
        return res.status(400).json({
          message: 'New password is required',
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          message: 'Password must be at least 6 characters',
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10,
      );

      await pool.query(
        `UPDATE users
         SET password = $1,
             reset_password_token = NULL,
             reset_password_token_expires_at = NULL
         WHERE id = $2`,
        [hashedPassword, user.id],
      );

      res.json({
        message: 'Password reset successfully',
      });
    } catch (error) {
      console.error('RESET PASSWORD ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const {email, password} = req.body;

    try {
      // 1. Find user by email
      const result = await pool.query(
        `SELECT id, name, email, password, is_email_verified, role
         FROM users
         WHERE email = $1`,
        [email],
      );

      if (result.rows.length === 0) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      const user = result.rows[0];

      // 2. Check password
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password,
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: 'Invalid email or password',
        });
      }

      // 3. Check email verification
      if (!user.is_email_verified) {
        return res.status(403).json({
          message: 'Please verify your email before logging in',
        });
      }

      // 4. Create JWT
      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: '1d',
        },
      );

      // 5. Send response
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });


app.post('/api/auth/google', async (req, res) => {
  const {idToken, mode} = req.body;

  if (!['login', 'signup'].includes(mode)) {
    return res.status(400).json({
      message: 'Invalid Google authentication mode',
    });
  }

  if (!idToken) {
    return res.status(400).json({
      message: 'Google ID token is required',
    });
  }

  if (!process.env.GOOGLE_WEB_CLIENT_ID) {
    console.error('GOOGLE_WEB_CLIENT_ID is not configured');

    return res.status(500).json({
      message: 'Google authentication is not configured',
    });
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_WEB_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload || !payload.email || payload.email_verified !== true) {
      return res.status(401).json({
        message: 'A verified Google email is required',
      });
    }

    const email = payload.email.toLowerCase();
    const name = payload.name || email.split('@')[0];

    let result = await pool.query(
      `SELECT id, name, email, is_email_verified, role
       FROM users
       WHERE LOWER(email) = $1`,
      [email],
    );

    let user;

    if (result.rows.length > 0) {
      if (mode === 'signup') {
        return res.status(409).json({
          message: 'An account with this email already exists. Please log in.',
        });
      }

      user = result.rows[0];

      // Google has verified ownership of this email address.
      if (!user.is_email_verified) {
        const verifiedResult = await pool.query(
          `UPDATE users
           SET is_email_verified = TRUE,
               verification_token = NULL,
               verification_token_expires_at = NULL
           WHERE id = $1
           RETURNING id, name, email, is_email_verified, role`,
          [user.id],
        );

        user = verifiedResult.rows[0];
      }
    } else {
      if (mode === 'login') {
        return res.status(404).json({
          message: 'No account found with this Google email. Please sign up.',
        });
      }

      // Google-only accounts still need a value for the required
      // password column. The random value is never sent to the client.
      const randomPassword = crypto.randomBytes(48).toString('hex');
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      result = await pool.query(
        `INSERT INTO users
           (name, email, password, is_email_verified, role)
         VALUES ($1, $2, $3, TRUE, 'user')
         RETURNING id, name, email, is_email_verified, role`,
        [name, email, hashedPassword],
      );

      user = result.rows[0];
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {expiresIn: '1d'},
    );

    return res.json({
      message:
  mode === 'signup'
    ? 'Google sign-up successful'
    : 'Google login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error(
      'GOOGLE AUTHENTICATION ERROR:',
      error.message,
    );

    return res.status(401).json({
      message: 'Google authentication failed',
    });
  }
});

  app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT id, name, email, role, is_email_verified, created_at
         FROM users
         WHERE id = $1`,
        [req.user.userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      res.json({
        message: 'Authenticated user',
        user: result.rows[0],
      });
    } catch (error) {
      console.error('AUTH ME ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });

  app.get('/api/profile', authMiddleware, async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          user_id,
          profile_photo_url,
          address,
          city,
          state,
          country,
          postal_code,
          latitude,
          longitude,
          created_at
         FROM profiles
         WHERE user_id = $1`,
        [req.user.userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Profile not found',
        });
      }
  // remove
  console.log('PROFILE DATA:', result.rows[0]);

      res.json({
        message: 'Profile fetched successfully',
        profile: result.rows[0],
      });
    } catch (error) {
      console.error('GET PROFILE ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });

  app.get('/api/auth/debug-reset-token', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          email,
          reset_password_token,
          reset_password_token_expires_at,
          NOW() AS current_time
         FROM users
         WHERE reset_password_token IS NOT NULL`
      );

      console.log('RESET TOKENS IN DATABASE:', result.rows);

      res.json(result.rows);
    } catch (error) {
      console.error('DEBUG RESET TOKEN ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });
 // Get verified professionals for discovery

 app.get('/api/professionals', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         u.id,
         u.name,
         p.profile_photo_url,
         p.address,
         p.city,
         p.state,
         p.country,
         COALESCE(membership.plan_name, 'Free') AS membership_plan
       FROM users u
       LEFT JOIN profiles p ON p.user_id = u.id
       LEFT JOIN LATERAL (
         SELECT pl.name AS plan_name
         FROM user_plans up
         JOIN plans pl ON pl.id = up.plan_id
         WHERE up.user_id = u.id
           AND up.is_active = TRUE
           AND up.payment_status = 'completed'
           AND (up.expiry_time IS NULL OR up.expiry_time > NOW())
           AND pl.name IN ('Silver', 'Gold')
         ORDER BY up.created_at DESC
         LIMIT 1
       ) membership ON TRUE
       WHERE u.is_email_verified = TRUE
         AND COALESCE(u.role, 'user') <> 'admin'
         AND u.id <> $1
       ORDER BY
         CASE WHEN membership.plan_name = 'Gold' THEN 0 ELSE 1 END,
         u.name ASC
       LIMIT 100`,
      [req.user.userId],
    );

    return res.json({
      professionals: result.rows,
    });
  } catch (error) {
    console.error('GET PROFESSIONALS ERROR:', error);

    return res.status(500).json({
      message: 'Unable to load professionals',
    });
  }
});

  app.get('/api/plans', async (req, res) => {
    try {
      const result = await pool.query(
        `SELECT
          id,
          name,
          duration_hours,
          price,
          is_active
         FROM plans
         WHERE is_active = TRUE
         ORDER BY id`,
      );

      res.json({
        message: 'Plans fetched successfully',
        plans: result.rows,
      });
    } catch (error) {
      console.error('GET PLANS ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });

  app.post('/api/profile/photo',
    authMiddleware,
    profileImageUpload.single('photo'),
    async (req, res) => {
      if (!req.file) {
        return res.status(400).json({
          message: 'Please select a profile photo.',
        });
      }

      const extensionByType = {
        'image/jpeg': 'jpg',
        'image/png': 'png',
        'image/webp': 'webp',
      };

      const key =
        `profile-photos/${req.user.userId}/` +
        `${crypto.randomUUID()}.${extensionByType[req.file.mimetype]}`;

      try {
        await uploadToStorj({
          key,
          body: req.file.buffer,
          contentType: req.file.mimetype,
        });

        const result = await pool.query(
          `INSERT INTO profiles (user_id, profile_photo_url)
           VALUES ($1, $2)
           ON CONFLICT (user_id)
           DO UPDATE SET profile_photo_url = EXCLUDED.profile_photo_url
           RETURNING *`,
          [req.user.userId, key],
        );

        return res.json({
          message: 'Profile photo uploaded successfully.',
          profile: result.rows[0],
        });
      } catch (error) {
        console.error('PROFILE PHOTO UPLOAD ERROR:', error.message);

        return res.status(500).json({
          message: 'Unable to upload profile photo.',
        });
      }
    },
  );
  app.get('/api/profile/photo', authMiddleware, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT profile_photo_url FROM profiles WHERE user_id = $1',
        [req.user.userId],
      );

      const key = result.rows[0]?.profile_photo_url;

      if (!key) {
        return res.status(404).json({ message: 'Profile photo not found.' });
      }

      const photo = await getFromStorj(key);

      res.setHeader('Content-Type', photo.ContentType || 'image/jpeg');
      res.setHeader('Cache-Control', 'private, max-age=300');

      photo.Body.pipe(res);
    } catch (error) {
      console.error('PROFILE PHOTO FETCH ERROR:', error.message);
      res.status(500).json({ message: 'Unable to load profile photo.' });
    }
  });
  app.get('/api/profile/photo/base64', authMiddleware, async (req, res) => {
    try {
      const result = await pool.query(
        'SELECT profile_photo_url FROM profiles WHERE user_id = $1',
        [req.user.userId],
      );

      const key = result.rows[0]?.profile_photo_url;

      if (!key) {
        return res.status(404).json({ message: 'Photo not found.' });
      }

      const photo = await getFromStorj(key);
      const chunks = [];

      for await (const chunk of photo.Body) {
        chunks.push(chunk);
      }

      res.json({
        mimeType: photo.ContentType || 'image/jpeg',
        base64: Buffer.concat(chunks).toString('base64'),
      });
    } catch (error) {
      console.error('PROFILE PHOTO FETCH ERROR:', error);
      res.status(500).json({ message: 'Unable to load photo.' });
    }
  });
  app.get(
    '/api/users/:userId/profile-photo/base64',
    authMiddleware,
    async (req, res) => {
      try {
        const userId = Number(req.params.userId);

        if (!Number.isInteger(userId) || userId <= 0) {
          return res.status(400).json({ message: 'Invalid user ID.' });
        }

        const result = await pool.query(
          'SELECT profile_photo_url FROM profiles WHERE user_id = $1',
          [userId],
        );

        const key = result.rows[0]?.profile_photo_url;

        if (!key) {
          return res.status(404).json({ message: 'Photo not found.' });
        }

        const photo = await getFromStorj(key);
        const chunks = [];

        for await (const chunk of photo.Body) {
          chunks.push(chunk);
        }

        return res.json({
          mimeType: photo.ContentType || 'image/jpeg',
          base64: Buffer.concat(chunks).toString('base64'),
        });
      } catch (error) {
        console.error('USER PROFILE PHOTO FETCH ERROR:', error);
        return res.status(500).json({ message: 'Unable to load photo.' });
      }
    },
  );
  app.put('/api/profile', authMiddleware, async (req, res) => {
    const {
      profile_photo_url,
      address,
      city,
      state,
      country,
      postal_code,
      latitude,
      longitude,
    } = req.body;

    try {
      const result = await pool.query(
        `INSERT INTO profiles (
          user_id,
          profile_photo_url,
          address,
          city,
          state,
          country,
          postal_code,
          latitude,
          longitude
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (user_id)
        DO UPDATE SET
         profile_photo_url = COALESCE(
  EXCLUDED.profile_photo_url,
  profiles.profile_photo_url
),
          address = EXCLUDED.address,
          city = EXCLUDED.city,
          state = EXCLUDED.state,
          country = EXCLUDED.country,
          postal_code = EXCLUDED.postal_code,
          latitude = EXCLUDED.latitude,
          longitude = EXCLUDED.longitude
        RETURNING *`,
        [
          req.user.userId,
          profile_photo_url,
          address,
          city,
          state,
          country,
          postal_code,
          latitude,
          longitude,
        ],
      );

      res.json({
        message: 'Profile saved successfully',
        profile: result.rows[0],
      });
    } catch (error) {
      console.error('UPDATE PROFILE ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });

app.get('/api/paypal/return', (req, res) => {
  const orderId = req.query.token;

  if (typeof orderId !== 'string' || !orderId) {
    return res.status(400).send('Missing PayPal order ID.');
  }

  const appUrl = `skillconnect://paypal-return?orderId=${encodeURIComponent(orderId)}`;

  return res.redirect(302, appUrl);
});

app.get('/api/paypal/cancel', (req, res) => {
  return res.redirect(302, 'skillconnect://paypal-cancel');
});


  app.post('/api/capture-payment', authMiddleware, async (req, res) => {
    const {order_id} = req.body;

    if (!order_id) {
      return res.status(400).json({
        message: 'order_id is required',
      });
    }

    const client = await pool.connect();

    try {
      // Verify that this PayPal order belongs to the logged-in user's
      // pending membership.
      const membershipResult = await client.query(
        `SELECT
          up.id AS user_plan_id,
          up.plan_id,
          up.paypal_order_id,
          up.payment_status,
          up.is_active,
          p.name AS plan_name,
          p.duration_hours,
          p.price
         FROM user_plans up
         JOIN plans p ON p.id = up.plan_id
         WHERE up.user_id = $1
           AND up.paypal_order_id = $2
         LIMIT 1`,
        [req.user.userId, order_id],
      );

      if (membershipResult.rows.length === 0) {
        return res.status(404).json({
          message: 'PayPal order not found for this user',
        });
      }

      const membership = membershipResult.rows[0];

      if (
        membership.payment_status === 'completed' &&
        membership.is_active
      ) {
        return res.json({
          message: 'Payment has already been completed',
          userPlanId: membership.user_plan_id,
        });
      }

      if (
        membership.payment_status !== 'pending' ||
        membership.is_active
      ) {
        return res.status(409).json({
          message: 'This membership is not awaiting payment',
        });
      }

      const accessToken = await getPayPalAccessToken();

      const captureResponse = await axios.post(
        `${PAYPAL_BASE_URL}/v2/checkout/orders/${encodeURIComponent(order_id)}/capture`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const paypalOrder = captureResponse.data;

      if (paypalOrder.status !== 'COMPLETED') {
        return res.status(402).json({
          message: 'PayPal payment has not been completed',
          paymentStatus: paypalOrder.status,
        });
      }

      const purchaseUnit = paypalOrder.purchase_units?.[0];
      const capture = purchaseUnit?.payments?.captures?.[0];

      if (
        !capture ||
        capture.status !== 'COMPLETED' ||
        purchaseUnit.reference_id !== String(membership.user_plan_id)
      ) {
        return res.status(402).json({
          message: 'PayPal capture could not be verified',
        });
      }

      const expectedAmount = (
        Number(membership.price) / INR_PER_USD
      ).toFixed(2);

      if (
        capture.amount?.currency_code !== 'USD' ||
        Number(capture.amount?.value) !== Number(expectedAmount)
      ) {
        console.error('PAYPAL AMOUNT MISMATCH:', {
          expectedAmount,
          actualAmount: capture.amount,
        });

        return res.status(400).json({
          message: 'PayPal payment amount did not match the plan price',
        });
      }

      await client.query('BEGIN');

      // Lock and re-check the membership before activating it.
      const lockedResult = await client.query(
        `SELECT id, payment_status, is_active
         FROM user_plans
         WHERE id = $1 AND user_id = $2
         FOR UPDATE`,
        [membership.user_plan_id, req.user.userId],
      );

      const lockedMembership = lockedResult.rows[0];

      if (
        !lockedMembership ||
        lockedMembership.payment_status !== 'pending' ||
        lockedMembership.is_active
      ) {
        await client.query('ROLLBACK');

        return res.status(409).json({
          message: 'Membership was changed while payment was processing',
        });
      }

      // Deactivate any previous active membership for this user.
      await client.query(
        `UPDATE user_plans
         SET is_active = FALSE
         WHERE user_id = $1 AND is_active = TRUE`,
        [req.user.userId],
      );

      const updateResult = await client.query(
        `UPDATE user_plans
         SET payment_status = 'completed',
             is_active = TRUE,
             paypal_capture_id = $1,
             start_time = NOW(),
             expiry_time = NOW() + ($2 * INTERVAL '1 hour')
         WHERE id = $3 AND user_id = $4
         RETURNING id, plan_id, start_time, expiry_time,
                   payment_status, is_active`,
        [
          capture.id,
          membership.duration_hours,
          membership.user_plan_id,
          req.user.userId,
        ],
      );

      await client.query('COMMIT');

      return res.json({
        message: 'Payment completed and membership activated',
        userPlan: updateResult.rows[0],
      });
    } catch (error) {
      if (client) {
        try {
          await client.query('ROLLBACK');
        } catch (rollbackError) {
          console.error('PAYMENT ROLLBACK ERROR:', rollbackError.message);
        }
      }

      console.error(
        'CAPTURE PAYPAL PAYMENT ERROR:',
        error.response?.data || error.message,
      );

      return res.status(500).json({
        message: 'Could not verify or capture PayPal payment',
      });
    } finally {
      client.release();
    }
  });

  app.post('/api/my-plan', authMiddleware, async (req, res) => {
    const {plan_id} = req.body;

    if (!plan_id) {
      return res.status(400).json({
        message: 'plan_id is required',
      });
    }

    try {
      const planResult = await pool.query(
        `SELECT
          id,
          name,
          duration_hours,
          price,
          is_active
         FROM plans
         WHERE id = $1
         AND is_active = TRUE`,
        [plan_id],
      );

      if (planResult.rows.length === 0) {
        return res.status(404).json({
          message: 'Plan not found',
        });
      }

      const plan = planResult.rows[0];

      const result = await pool.query(
        `INSERT INTO user_plans (
          user_id,
          plan_id,
          payment_status,
          is_active
        )
        VALUES ($1, $2, 'pending', FALSE)
        RETURNING *`,
        [req.user.userId, plan.id],
      );
  // remove it
  console.log(
    'DISCOVER MEMBERSHIPS:',
    result.rows.map(user => ({
      id: user.id,
      name: user.name,
      membership_plan: user.membership_plan,
    })),
  );
      res.status(201).json({
        message: 'Plan selection created',
        userPlan: result.rows[0],
        plan,
      });
    } catch (error) {
      console.error('CREATE PLAN SELECTION ERROR:', error);

      res.status(500).json({
        message: 'Something went wrong',
      });
    }
  });


  app.post('/api/create-payment', authMiddleware, async (req, res) => {
    const {user_plan_id} = req.body;

    if (!user_plan_id) {
      return res.status(400).json({
        message: 'user_plan_id is required',
      });
    }

    try {
      // Find this user's pending membership and its plan.
      const result = await pool.query(
        `SELECT
          up.id AS user_plan_id,
          up.user_id,
          up.payment_status,
          up.is_active AS membership_active,
          up.paypal_order_id,
          p.id AS plan_id,
          p.name AS plan_name,
          p.duration_hours,
          p.price
         FROM user_plans up
         JOIN plans p ON p.id = up.plan_id
         WHERE up.id = $1
           AND up.user_id = $2
           AND up.payment_status = 'pending'
           AND up.is_active = FALSE
           AND p.is_active = TRUE`,
        [user_plan_id, req.user.userId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({
          message: 'Pending membership not found for this user',
        });
      }

      const membership = result.rows[0];

      if (Number(membership.price) <= 0) {
        return res.status(400).json({
          message: 'This plan does not have a valid payment amount',
        });
      }

      // Avoid creating another PayPal order for the same membership.
      if (membership.paypal_order_id) {
        return res.status(409).json({
          message: 'A PayPal order already exists for this membership',
          orderId: membership.paypal_order_id,
        });
      }

      const amountInUsd = (
        Number(membership.price) / INR_PER_USD
      ).toFixed(2);

      if (Number(amountInUsd) <= 0) {
        return res.status(400).json({
          message: 'The converted payment amount must be greater than zero',
        });
      }

      const accessToken = await getPayPalAccessToken();

      const paypalResponse = await axios.post(
        `${PAYPAL_BASE_URL}/v2/checkout/orders`,
        {
          intent: 'CAPTURE',
          purchase_units: [
            {
              reference_id: String(membership.user_plan_id),
              description: `${membership.plan_name} membership`,
              amount: {
                currency_code: 'USD',
                value: amountInUsd,
              },
            },
          ],
          application_context: {
            brand_name: 'SkillConnect',
            user_action: 'PAY_NOW',
            return_url: `${process.env.PUBLIC_API_URL || 'https://bullhorn-stapling-stapling.ngrok-free.dev'}/api/paypal/return`,
            cancel_url: `${process.env.PUBLIC_API_URL || 'https://bullhorn-stapling-stapling.ngrok-free.dev'}/api/paypal/cancel`,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );

      const order = paypalResponse.data;
      const approvalLink = order.links?.find(
        link => link.rel === 'approve' || link.rel === 'payer-action',
      );

      if (!order.id || !approvalLink?.href) {
        console.error('PAYPAL ORDER RESPONSE:', order);

        return res.status(502).json({
          message: 'PayPal did not return an approval link',
        });
      }

      // Store the PayPal order against this user's pending membership.
      const updateResult = await pool.query(
        `UPDATE user_plans
         SET paypal_order_id = $1
         WHERE id = $2
           AND user_id = $3
           AND payment_status = 'pending'
           AND is_active = FALSE
           AND paypal_order_id IS NULL
         RETURNING id`,
        [order.id, membership.user_plan_id, req.user.userId],
      );

      if (updateResult.rows.length === 0) {
        return res.status(409).json({
          message: 'Membership changed before the PayPal order could be saved',
        });
      }

      return res.status(201).json({
        message: 'PayPal order created successfully',
        orderId: order.id,
        approvalUrl: approvalLink.href,
        amount: amountInUsd,
        currency: 'USD',
        originalAmount: Number(membership.price),
        originalCurrency: 'INR',
      });
    } catch (error) {
      console.error(
        'CREATE PAYPAL ORDER ERROR:',
        error.response?.data || error.message,
      );

      return res.status(500).json({
        message: 'Could not create PayPal order',
      });
    }
  });



app.get('/api/my-plan', authMiddleware, async (req, res) => {
  try {
    // Deactivate expired paid memberships for this user.
    await pool.query(
      `UPDATE user_plans
       SET is_active = FALSE
       WHERE user_id = $1
         AND is_active = TRUE
         AND expiry_time IS NOT NULL
         AND expiry_time <= NOW()`,
      [req.user.userId],
    );

    // Fetch the user's latest active, unexpired paid membership.
    const result = await pool.query(
      `SELECT
        up.id,
        up.user_id,
        up.plan_id,
        p.name,
        p.duration_hours,
        p.price,
        up.start_time,
        up.expiry_time,
        up.is_active,
        up.payment_status
       FROM user_plans up
       JOIN plans p ON p.id = up.plan_id
       WHERE up.user_id = $1
         AND up.is_active = TRUE
         AND up.payment_status = 'completed'
         AND (up.expiry_time IS NULL OR up.expiry_time > NOW())
         AND p.name IN ('Silver', 'Gold')
       ORDER BY up.created_at DESC
       LIMIT 1`,
      [req.user.userId],
    );

    if (result.rows.length > 0) {
      return res.json({
        message: 'Current plan fetched successfully',
        userPlan: result.rows[0],
      });
    }
    // If no active paid membership exists, return Free.
    const freePlan = await pool.query(
      `SELECT id, name, duration_hours, price, is_active
       FROM plans
       WHERE name = 'Free'
         AND is_active = TRUE
       ORDER BY id
       LIMIT 1`,
    );

    if (freePlan.rows.length === 0) {
      return res.status(404).json({
        message: 'Free plan is not configured',
      });
    }

    return res.json({
      message: 'Current plan fetched successfully',
      userPlan: {
        plan_id: freePlan.rows[0].id,
        name: freePlan.rows[0].name,
        duration_hours: freePlan.rows[0].duration_hours,
        price: freePlan.rows[0].price,
        start_time: null,
        expiry_time: null,
        is_active: true,
        payment_status: 'free',
      },
    });
  } catch (error) {
    console.error('GET MY PLAN ERROR:', error);

    res.status(500).json({
      message: 'Something went wrong',
    });
  }
});


app.get(
  '/api/admin/users',
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page, 10) || 1);
      const limit = Math.min(
        50,
        Math.max(1, parseInt(req.query.limit, 10) || 10),
      );
      const offset = (page - 1) * limit;

      const search = (req.query.search || '').trim();
      const status = (req.query.status || '').trim().toLowerCase();

      if (status && !['verified', 'unverified'].includes(status)) {
        return res.status(400).json({
          message: 'Status must be verified or unverified',
        });
      }

      const values = [];
      const conditions = [];

      if (search) {
        values.push(`%${search}%`);
        conditions.push(
          `(name ILIKE $${values.length} OR email ILIKE $${values.length})`,
        );
      }

      if (status) {
        values.push(status === 'verified');
        conditions.push(`is_email_verified = $${values.length}`);
      }

      const whereClause = conditions.length
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

      const countResult = await pool.query(
        `SELECT COUNT(*)::int AS total
         FROM users
         ${whereClause}`,
        values,
      );

      const total = countResult.rows[0].total;
      const usersResult = await pool.query(
        `SELECT
  u.id,
  u.name,
  u.email,
  u.role,
  u.is_email_verified,
  u.created_at,
  p.profile_photo_url,
  COALESCE(membership.plan_name, 'Free') AS membership_plan,
  membership.expiry_time AS membership_expiry_time
FROM users u
LEFT JOIN profiles p ON p.user_id = u.id
         LEFT JOIN LATERAL (
           SELECT
             pl.name AS plan_name,
             up.expiry_time
           FROM user_plans up
           JOIN plans pl ON pl.id = up.plan_id
           WHERE up.user_id = u.id
             AND up.is_active = TRUE
             AND up.payment_status = 'completed'
             AND (up.expiry_time IS NULL OR up.expiry_time > NOW())
             AND pl.name IN ('Silver', 'Gold')
           ORDER BY up.created_at DESC
           LIMIT 1
         ) membership ON TRUE
         ${whereClause}
         ORDER BY u.created_at DESC, u.id DESC
         LIMIT $${values.length + 1}
         OFFSET $${values.length + 2}`,
        [...values, limit, offset],
      );

      res.json({
        users: usersResult.rows,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error('ADMIN USER LIST ERROR:', error);
      res.status(500).json({
        message: 'Unable to fetch users',
      });
    }
  },
);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0',() => {
  console.log(`Server running on port ${PORT}`);
});