"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Icons
import { TiTick } from "react-icons/ti";
import { SlPicture } from "react-icons/sl";
import { TfiReload } from "react-icons/tfi";
import { PiPasswordThin } from "react-icons/pi";
import { CiUser, CiWarning, CiMail } from "react-icons/ci";

// Firebase
import { doc, setDoc } from "firebase/firestore";
import { auth, db, storage } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { StorageReference, ref, uploadBytes } from "firebase/storage";

const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowSuccess, setIsShowSuccess] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isAlertFields, setIsAlertFields] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAlertPasswords, setIsAlertPasswords] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword || !selectedFile || !fullName) {
      setIsAlertFields(true);
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setIsAlertPasswords(true);
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const signUpUser = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Firebase Storage
      if (signUpUser.user && selectedFile) {
        const storageRef: StorageReference = ref(
          storage,
          `profile-pictures/${signUpUser.user.uid}`
        );

        await uploadBytes(storageRef, selectedFile);
      }

      //Firestore
      if (signUpUser.user) {
        await setDoc(doc(db, "users", signUpUser.user.uid), {
          email: signUpUser.user.email,
          uid: signUpUser.user.uid,
          fullName: fullName,
          role: "Admin",
        });
        setIsShowSuccess(true);
        router.push("/signIn");
      }
      setIsLoading(false);
    } catch (error) {
      const errorCode = (error as any).code;
      if (errorCode == "auth/email-already-in-use") {
        setError("The email address is already in use");
      }
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-[80vh]">
      <form onSubmit={handleSubmit}>
        {/* Upload profile pic */}
        <div className="flex justify-normal items-center gap-4 border border-gray-200 text-gray-400 text-sm w-96 p-2 rounded-lg">
          <SlPicture className="text-xl" />
          <label htmlFor="profile_pic">
            {selectedFile ? "Selected" : "Select your profile picture"}
          </label>
          <input
            id="profile_pic"
            type="file"
            accept="image/*"
            onChange={(event) =>
              setSelectedFile(event.target.files?.[0] || null)
            }
            className="px-10 w-96 h-10 hidden"
          />
        </div>

        {/* FullName */}
        <div className="relative mt-4">
          <CiUser className="absolute top-2 left-2 text-2xl text-gray-400" />
          <input
            type="text"
            placeholder="FullName"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            className="px-10 w-96 h-10"
          />
        </div>

        {/* Email */}
        <div className="relative mt-4">
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

        {/* Confirm password */}
        <div className="relative mt-4">
          <PiPasswordThin className="absolute top-2 left-2 text-2xl text-gray-400" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
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
            <Link href={"/signIn"} className="underline text-main font-bold">
              Already have an account?
            </Link>
          </div>
        </div>

        {/* Button */}
        <div className="mt-4">
          {!isLoading ? (
            <button
              type="submit"
              className="bg-main text-white hover:bg-white hover:text-main h-10 border transition-all ease-in-out duration-400 rounded-lg w-96 font-bold"
            >
              SIGN UP
            </button>
          ) : (
            <button
              disabled
              className="flex justify-center items-center bg-main text-white hover:bg-white hover:text-main h-10 border transition-all ease-in-out duration-400 rounded-lg w-96 font-bold"
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
            <div className="text-green-600">SignUp Successful</div>
          )}
        </div>
      </form>
    </section>
  );
};

export default SignUp;
