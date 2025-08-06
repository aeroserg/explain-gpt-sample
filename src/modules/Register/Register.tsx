import { RegisterForm } from "./components";

const Register = () => {
  return (
    <div className="mx-auto max-w-[377px] pt-[65px] flex flex-col items-center">
      <h1 className="text-blue-gray-dark p1 text-center mb-[167px]">
        <span className="font-semibold">ExplainGPT</span> Account
      </h1>
      <p className="font-medium subtitle mb-5">Регистрация</p>
      <RegisterForm />
    </div>
  );
};

export default Register;
