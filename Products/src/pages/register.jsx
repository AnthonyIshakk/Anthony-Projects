import { useContext, useState } from "react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { useNavigate } from "react-router";
import { AuthContext } from "@/context/AuthContext";

export default function RegisterPage() {
  const { handleRegister, loading, error } = useContext(AuthContext);
  const navigate = useNavigate();
  const [state, setState] = useState({
    name: "",
    email: "",
    password: "",
    merchantName: "",
  });

  const { name, email, password, merchantName } = state;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const succ = await handleRegister({ name, email, password, merchantName });
    if (succ) navigate("/cards");
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4">
      <div className={cn("flex flex-col gap-6 w-full max-w-sm")}>
        <Card>
          <CardHeader>
            <CardTitle>Create an account</CardTitle>
            <CardDescription>
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) =>
                      setState((s) => ({ ...s, name: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={email}
                    onChange={(e) =>
                      setState((s) => ({ ...s, email: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) =>
                      setState((s) => ({ ...s, password: e.target.value }))
                    }
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="merchantName">Merchant Name</Label>
                  <Input
                    id="merchantName"
                    type="text"
                    placeholder="Choose a merchant name"
                    value={merchantName}
                    onChange={(e) =>
                      setState((s) => ({ ...s, merchantName: e.target.value }))
                    }
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </Button>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
