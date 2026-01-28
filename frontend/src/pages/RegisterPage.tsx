import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { Input, Button, Toast } from "../components/common";

export const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { message, type, show } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      show("كلمات المرور غير متطابقة", "error");
      return;
    }

    setLoading(true);

    try {
      await register(username, email, password);
      show("🎉 تم إنشاء الحساب بنجاح!", "success");
      setTimeout(() => navigate("/"), 1000);
    } catch (err) {
      show("❌ فشل إنشاء الحساب", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Toast message={message} type={type} />
      <div className="auth-container">
        <h1>إنشاء حساب جديد</h1>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="اسم المستخدم"
            value={username}
            onChange={setUsername}
          />
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
          <Input
            type="password"
            placeholder="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />
          <Button disabled={loading} className="w-full">
            {loading ? "جاري الإنشاء..." : "إنشاء حساب"}
          </Button>
        </form>
        <p>
          لديك حساب بالفعل؟{" "}
          <a href="/login">
            تسجيل الدخول
          </a>
        </p>
      </div>
    </div>
  );
};
