import React, { useCallback, useState, useRef } from 'react';
import { NextPage } from 'next';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import { Box, Button, Checkbox, FormControlLabel, FormGroup, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { logIn, signUp } from '../../libs/auth';
import { sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { Clock, User, Lock, Phone, Mail, Upload } from 'lucide-react';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const Join: NextPage = () => {
  const router = useRouter();
  const device = useDeviceDetect();
  const [input, setInput] = useState({ nick: '', password: '', phone: '', email: '', type: 'CUSTOMER' });
  const [loginView, setLoginView] = useState<boolean>(true);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  

  const viewChangeHandler = (state: boolean) => {
    setLoginView(state);
  };

  const checkUserTypeHandler = (e: any) => {
    const checked = e.target.checked;
    if (checked) {
      handleInput('type', e.target.name);
    } else {
      handleInput('type', 'CUSTOMER');
    }
  };

  const handleInput = useCallback((name: any, value: any) => {
    setInput((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const doLogin = useCallback(async () => {
    try {
      await logIn(input.nick, input.password);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input, router]);

  const doSignUp = useCallback(async () => {
    try {
      // In real implementation, you would include the profile image
      // For now, just log that we have an image
      if (profileImage) {
        console.log("Profile image selected:", profileImage.name);
      }
      
      await signUp(input.nick, input.password, input.phone, input.type);
      await router.push(`${router.query.referrer ?? '/'}`);
    } catch (err: any) {
      await sweetMixinErrorAlert(err.message);
    }
  }, [input, profileImage, router]);

  if (device === 'mobile') {
    return <div>LOGIN MOBILE</div>;
  }

  return (
    <Stack className="join-page bg-black">
      <Stack className="container">
        <Stack className="main">
          <Stack className="left">
            <Box className="logo">
              <div className="flex items-center">
                {/* <Clock className="text-amber-500" size={28} strokeWidth={1.5} /> */}
                <span className="ml-2 text-gray-100">ÉCLIPSE</span>
              </div>
            </Box>
            <Box className="info">
              <span className="uppercase text-amber-500">{loginView ? 'Welcome back' : 'Join us'}</span>
              <p className="text-gray-300">{loginView ? 'Login to access your Eclipse account' : 'Create your Eclipse luxury watch account'}</p>
            </Box>
            <Box className="input-wrap">
              <div className="input-box">
                <span>Nickname</span>
                <div className="input-container">
                  <User className="input-icon" size={16} />
                  <input
                    type="text"
                    placeholder="Enter Nickname"
                    onChange={(e) => handleInput('nick', e.target.value)}
                    required={true}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && loginView) doLogin();
                      if (event.key === 'Enter' && !loginView) doSignUp();
                    }}
                  />
                </div>
              </div>
              
              {!loginView && (
                <div className="input-box">
                  <span>Email</span>
                  <div className="input-container">
                    <Mail className="input-icon" size={16} />
                    <input
                      type="email"
                      placeholder="Enter Email"
                      onChange={(e) => handleInput('email', e.target.value)}
                      required={true}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') doSignUp();
                      }}
                    />
                  </div>
                </div>
              )}
              
              <div className="input-box">
                <span>Password</span>
                <div className="input-container">
                  <Lock className="input-icon" size={16} />
                  <input
                    type="password"
                    placeholder="Enter Password"
                    onChange={(e) => handleInput('password', e.target.value)}
                    required={true}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && loginView) doLogin();
                      if (event.key === 'Enter' && !loginView) doSignUp();
                    }}
                  />
                </div>
              </div>
              
              {!loginView && (
                <div className="input-box">
                  <span>Phone</span>
                  <div className="input-container">
                    <Phone className="input-icon" size={16} />
                    <input
                      type="text"
                      placeholder="Enter Phone"
                      onChange={(e) => handleInput('phone', e.target.value)}
                      required={true}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') doSignUp();
                      }}
                    />
                  </div>
                </div>
              )}
              
              {loginView && (
                <div className="input-box">
                  <span>Email</span>
                  <div className="input-container">
                    <Mail className="input-icon" size={16} />
                    <input
                      type="email"
                      placeholder="Enter Email"
                      onChange={(e) => handleInput('email', e.target.value)}
                      required={true}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') doLogin();
                      }}
                    />
                  </div>
                </div>
              )}
              
            </Box>
            <Box className="register">
              {!loginView && (
                <div className="type-option">
                  <span className="text">Register as:</span>
                  <div>
                    <FormGroup className="user-type-checkbox">
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="CUSTOMER"
                            onChange={checkUserTypeHandler}
                            checked={input?.type === 'CUSTOMER'}
							style={{color: "#fff"}}
                          />
                        }
                        label="Customer"
                      />
                    </FormGroup>
                    <FormGroup className="user-type-checkbox">
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="DEALER"
                            onChange={checkUserTypeHandler}
                            checked={input?.type === 'DEALER'}
							style={{color: "#fff"}}
                          />
                        }
                        label="Dealer"
                      />
                    </FormGroup>
                    <FormGroup className="user-type-checkbox">
                      <FormControlLabel
                        control={
                          <Checkbox
                            size="small"
                            name="MODERATOR"
                            onChange={checkUserTypeHandler}
                            checked={input?.type === 'MODERATOR'}
							style={{color: "#fff"}}
                          />
                        }
                        label="Moderator"
                      />
                    </FormGroup>
                  </div>
                </div>
              )}

              {loginView && (
                <div className="remember-info">
                  <FormGroup>
                    <FormControlLabel control={<Checkbox defaultChecked size="small" style={{color: "#fff"}}/>} label="Remember me" />
                  </FormGroup>
                  <a>Forgot password?</a>
                </div>
              )}

              {loginView ? (
                <Button
                  variant="contained"
                  disabled={input.nick === '' || input.password === '' || input.email === ''}
                  onClick={doLogin}
                  className="login-button"
                >
                  LOGIN
                </Button>
              ) : (
                <Button
                  variant="contained"
                  disabled={input.nick === '' || input.password === '' || input.phone === '' || input.email === '' || input.type === ''}
                  onClick={doSignUp}
                  className="signup-button"
                >
                  CREATE ACCOUNT
                </Button>
              )}
            </Box>
            <Box className="ask-info">
              {loginView ? (
                <p>
                  New to Eclipse?
                  <b
                    onClick={() => {
                      viewChangeHandler(false);
                    }}
                  >
                    REGISTER
                  </b>
                </p>
              ) : (
                <p>
                  Already have an account?
                  <b onClick={() => viewChangeHandler(true)}> SIGN IN</b>
                </p>
              )}
            </Box>
          </Stack>
         <Stack className="right" style={{ width: '50%', position: 'relative' }}>
  <img
    src="/img/banner/login.jpg"
    alt="Login Banner"
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</Stack>

        </Stack>
      </Stack>
    </Stack>
  );
};

export default withLayoutBasic(Join);