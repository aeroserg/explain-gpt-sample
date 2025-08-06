import { RegisterFormV2 } from "./components/RegisterFormV2";

const RegisterV2 = () => {
  return (
    <div className="relative min-h-screen">
      <h1 className="absolute top-[65px] left-0 right-0 mx-auto max-w-[300px] text-blue-gray-dark p1 text-center">
        <span className="font-semibold">ExplainGPT</span> Account
      </h1>

      <div className="flex h-screen items-center justify-center">
        <div className="w-full max-w-[300px]">
          <div className="flex w-full flex-col items-center gap-[23px]">
            <p className="font-medium text-[32px] leading-[39px] tracking-[0.008em] text-[#2B2B2B] text-center">
              Регистрация
            </p>
            <RegisterFormV2 />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterV2; 