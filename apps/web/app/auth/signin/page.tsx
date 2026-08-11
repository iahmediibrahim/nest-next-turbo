import Link from "next/link";
import SigninForm from "./signinForm";

const Signin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className=" bg-gray-50 max-w-md w-full space-y-8 p-6 rounded-2xl">
        <div>
          <h2 className="mt-6 mb-4 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <SigninForm />

        <div>
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/auth/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};
export default Signin;
