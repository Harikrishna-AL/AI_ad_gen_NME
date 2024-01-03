/// <reference no-default-lib="true"/>

import { useEffect } from "react";
import { supabase } from "../../utils/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GoogleButton from "react-google-button";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sendMail, setsendMail] = useState(false);

  async function signInWithEmail(email: string) {
    await supabase.auth.signInWithOtp({
      email: email,
      options: {
        emailRedirectTo: "https://flipkart-ai-dev-production.up.railway.app/",
        // "http://localhost:3000/",
      },
    });
  }

  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });
  };
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push("/");
      }
    };
    checkSession();
  });

  supabase.auth.onAuthStateChange((event) => {
    if (event == "SIGNED_IN") {
      router.push("/");
    }
  });

  return (
    <main className="w-full h-screen flex flex-col items-center justify-center px-4">
      <div className="max-w-sm w-full text-gray-600">
        <div className="text-center">
          <div className="mt-5 space-y-2">
            <h3 className="text-gray-800 text-2xl font-bold sm:text-3xl">
              Log in to your account
            </h3>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            signInWithEmail(email);
            // alert("Please check your email for login link");
            setsendMail(true);
          }}
          className="mt-8 space-y-5"
        >
          <div>
            <label className="font-medium">Email</label>
            <input
              type="email"
              required
              className="w-full mt-2 px-3 py-2 text-gray-500 bg-transparent outline-none border focus:border-yellow-600 shadow-sm rounded-lg"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="elon@musk.com"
              disabled={sendMail}
            />
          </div>

          {sendMail ? (
            <>
              <div className="w-full px-4 pt-2 text-yellow-500  font-medium hover: text-center">
                Please check your email for login link
              </div>
              <div
                className="w-full px-4 pt-0 text-black-500  font-medium hover: text-center cursor-pointer"
                onClick={() => setsendMail(false)}
              >
                Enter new Email
              </div>
            </>
          ) : (
            <button className="w-full px-4 py-2 text-white font-medium bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-400 rounded-lg duration-150">
              Sign in
            </button>
          )}
        </form>
        {!sendMail ? (
          <>
        <div className="text-center my-2">or</div>
        <div className="flex justify-center">
          <GoogleButton
            onClick={() => {
              signInWithGoogle();
            }}
          />
          {/* <button onClick={signInWithGoogle} className="w-full px-4 py-2 text-white font-medium bg-yellow-500 hover:bg-yellow-400 active:bg-yellow-400 rounded-lg duration-150">
              Sign in
            </button> */}
        </div>
        </>
        ): null}
      </div>
    </main>
  );
};

export default SignIn;
