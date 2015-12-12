// todo put this in .env for production
export const jwtSecret = process.env.JWT_SECRET || 'd3bcddbf-3687-45c4-bc8d-81b6ac34edfd';
export const googleClientID = process.env.GOOGLE_CLIENTID || '350131825371-c1p0sh9r7mrv28mu00fqucfv66ii9sgh.apps.googleusercontent.com';
export const googleClientSecret = process.env.GOOGLE_SECRET || 's3unv0lt2-mJD4yU2m_Zms3a';
export const googleCallbackURL = process.env.GOOGLE_CALLBACK || 'http://localhost:3000/auth/google/callback';

