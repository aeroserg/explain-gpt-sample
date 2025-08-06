import { LoginForm } from "./components";

const Login = () => {
  return (
    <div className="relative min-h-screen">
      <h1 className="absolute top-[65px] left-0 right-0 mx-auto max-w-[300px] text-blue-gray-dark p1 text-center">
        <span className="font-semibold">ExplainGPT</span> Account
      </h1>
      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-[300px]">
          <p className="font-medium text-[32px] leading-[39px] text-center text-[#2B2B2B] mb-5">
            Вход
          </p>
      <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
