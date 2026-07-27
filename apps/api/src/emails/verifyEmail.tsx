import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components";
import { formatDuration } from "../utils/formatDurration";

type VerifyEmailProps = {
    code: string;
    expiresIn?: number;
};

export default function VerifyEmail({
    code,
    expiresIn = 10 * 60,
}: VerifyEmailProps) {
    return (
        <Html>
            <Head />

            <Preview>
                Your odiano verification code
            </Preview>

            <Body
                style={{
                    backgroundColor: "#0a0a0a",
                    margin: 0,
                    padding: "40px 20px",
                    fontFamily:
                        "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
                    color: "#ffffff",
                }}
            >
                <Container
                    style={{
                        maxWidth: "520px",
                        margin: "0 auto",
                        backgroundColor: "#111111",
                        border: "1px solid #262626",
                        borderRadius: "20px",
                        padding: "40px",
                    }}
                >
                    {/* Logo */}
                    <Text
                        style={{
                            margin: 0,
                            fontSize: "22px",
                            fontWeight: 700,
                            color: "#ffffff",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        odiano
                    </Text>

                    <Hr
                        style={{
                            borderColor: "#262626",
                            margin: "28px 0",
                        }}
                    />

                    {/* Title */}
                    <Heading
                        style={{
                            color: "#ffffff",
                            fontSize: "28px",
                            lineHeight: "36px",
                            margin: 0,
                            fontWeight: 700,
                        }}
                    >
                        Verify your email
                    </Heading>

                    <Text
                        style={{
                            color: "#a3a3a3",
                            fontSize: "16px",
                            lineHeight: "26px",
                            marginTop: "16px",
                            marginBottom: "32px",
                        }}
                    >
                        Enter the verification code below to continue signing in
                        to your odiano account.
                    </Text>

                    {/* OTP */}
                    <Section
                        style={{
                            backgroundColor: "#171717",
                            border: "1px solid #262626",
                            borderRadius: "16px",
                            padding: "22px",
                            textAlign: "center",
                        }}
                    >
                        <Text
                            style={{
                                margin: 0,
                                color: "#737373",
                                fontSize: "13px",
                                textTransform: "uppercase",
                                letterSpacing: "2px",
                            }}
                        >
                            Verification Code
                        </Text>

                        <Text
                            style={{
                                margin: "18px 0 0",
                                fontSize: "42px",
                                fontWeight: 700,
                                letterSpacing: "12px",
                                color: "#ffffff",
                            }}
                        >
                            {code}
                        </Text>
                    </Section>

                    <Text
                        style={{
                            color: "#a3a3a3",
                            fontSize: "15px",
                            lineHeight: "24px",
                            marginTop: "28px",
                        }}
                    >
                        This code will expire in{" "}
                        <strong style={{ color: "#ffffff" }}>
                            {formatDuration(expiresIn)}
                        </strong>.
                    </Text>

                    <Text
                        style={{
                            color: "#737373",
                            fontSize: "14px",
                            lineHeight: "22px",
                            marginTop: "24px",
                        }}
                    >
                        If you didn't request this verification code, you can
                        safely ignore this email.
                    </Text>

                    <Hr
                        style={{
                            borderColor: "#262626",
                            margin: "32px 0 24px",
                        }}
                    />

                    <Text
                        style={{
                            color: "#525252",
                            fontSize: "13px",
                            textAlign: "center",
                            margin: 0,
                        }}
                    >
                        © {new Date().getFullYear()} odiano. All rights
                        reserved.
                    </Text>
                </Container>
            </Body>
        </Html>
    );
}