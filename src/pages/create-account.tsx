import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/spinner";
import { usePocketBase } from "@/lib/pb";
import { ClientResponseError } from "pocketbase";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Error = {
  name: { message: string };
  username: { message: string };
  email: { message: string };
  password: { message: string };
};

export default function SignIn() {
  const pb = usePocketBase();

  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      await pb
        .collection("users")
        .create({ name, username, email, password, passwordConfirm: password });
    } catch (err) {
      if (err instanceof ClientResponseError) {
        setError(err.data.data);
        setLoading(false);
      }
      return;
    }

    document.cookie = pb.authStore.exportToCookie({ httpOnly: false });

    navigate("/sign-in");
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            alt="UIUC Marketplace"
            src="/logo.svg"
            className="mx-auto h-10 w-auto"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Name
              </label>
              <div className="mt-2">
                <Input
                  id="name"
                  name="name"
                  type="name"
                  required
                  autoComplete="name"
                  className={`${error?.name ? "border-red-500" : ""}`}
                />
              </div>
              <div className="text-right mt-2">
                {error?.name && (
                  <span className="text-red-500 text-sm">
                    {error.name.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <Input
                  id="username"
                  name="username"
                  type="username"
                  required
                  autoComplete="username"
                  className={`${error?.username ? "border-red-500" : ""}`}
                />
              </div>
              <div className="text-right mt-2">
                {error?.username && (
                  <span className="text-red-500 text-sm">
                    {error.username.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className={`${error?.email ? "border-red-500" : ""}`}
                />
              </div>
              <div className="text-right mt-2">
                {error?.email && (
                  <span className="text-red-500 text-sm">
                    {error.email.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={`${error?.password ? "border-red-500" : ""}`}
                />
              </div>
              <div className="text-right mt-2">
                {error?.password && (
                  <span className="text-red-500 text-sm">
                    {error.password.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="flex gap-2 w-full justify-center"
              >
                Create Account
                {loading && <LoadingSpinner />}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
