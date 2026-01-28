import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Input, Button, Toast } from "../components/common";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { message, type, show } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      show("✅ تم تسجيل الدخول بنجاح!", "success");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      show("❌ بيانات الدخول غير صحيحة", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Toast message={message} type={type} />
      <div className="auth-container">
        <h1>تسجيل الدخول</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={setEmail}
          />
          <Input
            type="password"
            placeholder="كلمة المرور"
            value={password}
            onChange={setPassword}
          />
          <Button disabled={loading} className="w-full">
            {loading ? "جاري التحقق..." : "تسجيل الدخول"}
          </Button>
        </form>
        <p>
          ليس لديك حساب؟{" "}
          <a href="/register">
            إنشاء حساب
          </a>
        </p>
      </div>
    </div>
  );
};
