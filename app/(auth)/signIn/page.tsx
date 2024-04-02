"use client";
import Link from "next/link";
import { useState } from "react";
import { CiMail } from "react-icons/ci";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { TfiReload } from "react-icons/tfi";
import { PiPasswordThin } from "react-icons/pi";

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAlertFields, setIsAlertFields] = useState<boolean>(false);
  const [isAlertPasswords, setIsAlertPasswords] = useState<boolean>(false);
  const [isShowSuccess, setIsShowSuccess] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setIsAlertFields(true);
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setIsAlertPasswords(true);
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      setIsLoading(false);

      if (userCredential && userCredential.ok) {
        setIsShowSuccess(true);
        router.push("/");
      } else {
        setError("LogIn failed due incorrect credentials");
      }
    } catch (error) {
      console.error("Errors", error);
      setError("Something went wrong! Please try again");
      setIsLoading(false);
    }
  };
  
  return (
    <section className="flex justify-center items-center h-[80vh]">
      <form onSubmit={handleSubmit}>
        {/* Email */}
        <div className="relative">
          <CiMail className="absolute top-2 left-2 text-2xl text-gray-400" />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="px-10 w-96 h-10"
          />
        </div>

        {/* Password */}
        <div className="relative mt-4">
          <PiPasswordThin className="absolute top-2 left-2 text-2xl text-gray-400" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="px-10 w-96 h-10"
          />
        </div>
        
        {/* Remember me */}
        <div className="mt-4 w-96 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              className="bg-main"
              defaultChecked
              disabled
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              remember me
            </label>
          </div>

          <div className="text-[12px]">
            <Link href={"/signUp"} className="underline text-main font-bold">
              Forget password ?
            </Link>
          </div>
        </div>

        {/* Button */}
        <div className="mt-4">
          {!isLoading ? (
            <button className="bg-main text-white hover:bg-white hover:text-main h-10 border transition-all ease-in-out duration-400 rounded-lg w-96 font-bold">
              SIGN IN
            </button>
          ) : (
            <button
              disabled
              className="bg-main text-white hover:bg-white hover:text-main h-10 border transition-all ease-in-out duration-400 rounded-lg w-96 font-bold"
            >
              <TfiReload className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </button>
          )}
        </div>

        {/* Error & Message Handling */}
        <div className="text-red-600">
          {error && <div>{error}</div>}
          {isAlertFields && <div>* Please enter all the fields</div>}
          {isAlertPasswords && <div>* Passwords should be minimum 8 char</div>}
          {isShowSuccess && (
            <div className="text-green-600">SignIn Successful</div>
          )}
        </div>
      </form>
    </section>
  );
};

export default SignIn;
