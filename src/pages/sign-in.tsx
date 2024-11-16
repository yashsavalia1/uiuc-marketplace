import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { usePocketBase } from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const pb = usePocketBase();

  const navigate = useNavigate();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await pb.collection('users').authWithPassword(
        email,
        password
      );
    } catch (err) {
      if (err instanceof ClientResponseError) {
        setError("Incorrect email or password.");
        setLoading(false);
      }
      return;
    }

    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });

    navigate("/")
  }


  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="Your Company"
            src="/logo.svg"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`${error ? 'border-red-500' : ''}`}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                  Password
                </label>
                <div className="text-sm">
                  <a href="#" className="font-semibold hover:text-gray-500">
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={`${error ? 'border-red-500' : ''}`}
                />
              </div>
            </div>


            <div>
              <Button
                type="submit"
                className="flex gap-2 w-full justify-center"
              >
                Sign in
                {loading && <LoadingSpinner />}
              </Button>
            </div>
          </form>
          <div className="text-right mt-2">
            {error && (
              <span className="text-red-500 text-sm">{error}</span>
            )}
          </div>

          <p className="mt-10 text-center text-sm">
            <span className="text-gray-500">Not a member?</span>{' '}
            <a href="#" className="font-semibold hover:text-gray-500">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </>
  )
}