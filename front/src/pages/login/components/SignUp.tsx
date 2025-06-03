import RegisterForm from "./RegisterForm";

export default function SignUp() {
  return (
    <div className="flex flex-col gap-11 min-h-svh w-full items-center justify-center p-6 md:p-10 dark:bg-black ">
      <div className="w-full max-w-lg">
        <RegisterForm />
      </div>
    </div>
  );
}
