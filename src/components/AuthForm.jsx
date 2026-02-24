import { alpha, useTheme } from "@mui/material/styles";
import {
    Box,
    Button,
    ButtonGroup,
    FormControl,
    Input,
    InputLabel,
    Stack,
    Typography,
} from "@mui/material";
import {
    authButtonShadow,
    authButtonShadowSelected,
    primaryMainButtonShadow,
    primaryMainInputShadow,
    primaryMainShadow
} from "../utils/Shadows";

const customInputStyles = (theme) => ({
    boxShadow: primaryMainInputShadow(theme),
    borderRadius: 2,
    color: theme.palette.common.white,
    padding: "1rem",
    // the gradient bottom "border" (hidden by default)
    "&::after": {
        content: '""',
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: "2px", // <-- thickness of the "border"
        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.3)}, ${alpha(theme.palette.common.orange, 0.3)})`,
        transform: "scaleX(0)",
        transformOrigin: "left",
        transition: "transform 200ms ease",
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        pointerEvents: "none",
    },
    // show on hover
    "&:hover::after": {
        transform: "scaleX(1)",
    },
    // show when focused (Mui-focused is applied to the Input root)
    "&.Mui-focused::after": {
        transform: "scaleX(1)",
    }
});

export const AuthFormInput = ({
    id,
    label,
    value,
    onChange,
    type="text",
    autoFocus=false,
    required=true,
    size="medium" | "small" | "large"
}) => {
    const theme = useTheme();

    return (
        <FormControl>
            <InputLabel
                htmlFor={id}
                margin="dense"
                size="medium"
                sx={{
                    position: "absolute",
                    padding: 2,
                        margin: "-5px",
                    overflow: "hidden",
                    '&.MuiFormLabel-root': {
                        '&.MuiInputLabel-root': {
                            color: theme.palette.common.lightOrange,
                            '&:focus': {
                                color: "transparent",
                            },
                        },
                    },
                }}
            >
            {label}
            </InputLabel>
            <Input
                autoComplete="off"
                autoFocus={autoFocus}
                component="input"
                disableUnderline={true}
                fullWidth={true}
                id={id}
                inputProps={{
                    "aria-label": label,
                    "aria-required": required
                }}
                onChange={onChange}
                required={required}
                size={size}
                sx={customInputStyles(theme)}
                type={type}
                value={value}
            />
        </FormControl>
    );
}

export const AuthForm = ({
    email,
    setEmail,
    password,
    setPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    handleAuth,
    loginFormSelected,
    setLoginFormSelected,
    children 
}) => {
    const theme = useTheme();

    const registerSelected = !loginFormSelected;

    const handleFormSelection = (selected) => {
        setLoginFormSelected(selected === "login");
    }

    console.log(`email: ${email}`);

    return (
        <Stack
            aria-label={loginFormSelected ? "Login form" : "Register form" }
            component="form"
            onSubmit={handleAuth}
            role="form"  // role explicitly set for accessibility
            spacing={5}
            style={{
                bgcolor: 'background.paper',  // same as primary.main
                borderRadius: 8,
                boxShadow: primaryMainShadow(theme),
                height: "fit-content",
                margin: "2rem",
                padding: "4rem",
                width: "fit-content",
            }}
        >
            <h1 style={{ padding: "24px", color: theme.palette.common.lightOrange }}>
                Welcome to Rock of Ages
            </h1>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}
            >
            <ButtonGroup>
                <Button
                    aria-pressed={loginFormSelected}
                    disableElevation={true}
                    disableRipple={true}
                    id="login-button"
                    onClick={() => { handleFormSelection("login") }}
                    variant="contained"
                    sx={{
                        boxShadow: loginFormSelected
                            ? authButtonShadowSelected(theme)
                            : authButtonShadow(theme, 1),
                        '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            boxShadow: loginFormSelected
                                ? authButtonShadowSelected(theme)
                                : authButtonShadow(theme, 1),
                        }
                    }}
                >
                    <Typography
                        sx={{
                            color: loginFormSelected
                                ? alpha(theme.palette.success.light, 0.8)
                                : theme.palette.common.lightGray
                        }}
                        variant="h6"
                    >
                        Login
                    </Typography>
                </Button>
                <Button
                    aria-pressed={registerSelected}
                    disableElevation={true}
                    disableRipple={true}
                    id="register-button"
                    onClick={() => handleFormSelection("register")}
                    variant="contained"
                    sx={{
                        boxShadow: registerSelected === true
                            ? authButtonShadowSelected(theme)
                            : authButtonShadow(theme, -1),
                        '&:hover': {
                            backgroundColor: theme.palette.primary.main,
                            boxShadow: registerSelected === true
                                ? authButtonShadowSelected(theme)
                                : authButtonShadow(theme, -1),
                        },
                        // This ensures MUI doesn't re-apply its own elevation
                        "&.MuiButton-contained:hover": {
                            boxShadow: registerSelected === true
                                ? authButtonShadowSelected(theme)
                                : authButtonShadow(theme, -1)
                        },
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: registerSelected
                                ? alpha(theme.palette.success.light, 0.8)
                                : theme.palette.common.lightGray
                        }}
                    >
                        Register
                    </Typography>
                </Button>
            </ButtonGroup>
            </Box>
            <AuthFormInput
                autoFocus={true}
                id="auth-form-email-field"
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                required={true}
                type="email"
                value={email}
            />
            <AuthFormInput
                autoFocus={false}
                id="auth-form-password-field"
                label="Password"
                onChange={(e) => setPassword(e.target.value)}
                required={true}
                type="password"
                value={password}
            />
            {registerSelected === true && (
                <>
                    <AuthFormInput
                        autoFocus={false}
                        id="auth-form-firstname-field"
                        label="First name"
                        onChange={(e) => setFirstName(e.target.value)}
                        required={true}
                        type="firstname"
                        value={firstName}
                    />
                    <AuthFormInput
                        autoFocus={false}
                        id="auth-form-lastname-field"
                        label="Last name"
                        onChange={(e) => setLastName(e.target.value)}
                        required={true}
                        type="lastname"
                        value={lastName}
                    />
                </>
            )}
            <Button
                className="submit-button"
                disableRipple={true}
                fullWidth={true}
                onClick={() => handleAuth}
                size="large"
                sx={{
                    bgcolor: alpha(theme.palette.primary.light, 0.3),
                    boxShadow: primaryMainButtonShadow(theme),
                    padding: "1rem",
                    transition: 'background 1s ease',
                    '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.3)}, ${alpha(theme.palette.common.orange, 0.3)})`
                    },
                }}
                type="submit"
            >
                <Typography color={theme.palette.common.lightOrange} variant="h6">
                    Sign In
                </Typography>
            </Button>
            {children}
        </Stack>
    );
}