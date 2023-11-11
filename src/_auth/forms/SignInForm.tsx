import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import Loader from "./../../components/shared/Loader";
import { SignInValidation } from "./../../lib/validation/index";

import { useToast } from "@/components/ui/use-toast";
import { useUserContext } from "@/context/AuthContext";
import { useSignInAccount } from "@/lib/react-query/queriesAndMutations";

const SignInForm = () => {
  const { toast } = useToast();

  // context data

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signInAccount, isPending: isSignInUser } =
    useSignInAccount();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof SignInValidation>>({
    resolver: zodResolver(SignInValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignInValidation>) {
    const session = await signInAccount({
      email: values.email,
      password: values.password,
    });
    if (!session) {
      return toast({
        title: "Sign Up into  Account failed",
      });
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate("/");
    } else {
      toast({
        title: "Sign Up into  Account failed",
      });
    }
  }

  return (
    <>
      {isUserLoading ? (
        <div className="flex flex-center w-full h-full z-999">
          <Loader />
        </div>
      ) : (
        <Form {...form}>
          <div className="sm:w-420 flex-center flex-col">
            <img src="/assets/images/logo.svg" />
            <h2 className="h3-hold md:h2-bold pt-5 sm:pt-12">Log In Account</h2>
            <p className="text-light-3 small-medium md:base-regular mt-2">
              Please Sign in to continue your journey
            </p>

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5 w-full mt-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" className="shad-input" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        className="shad-input"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="shad-button_primary">
                {isSignInUser ? (
                  <div className=" flex-center gap-2">
                    <Loader /> Loading...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              <p className="text-small-regular text-light-1 text-center mt-2 ">
                Don't have account ?{" "}
                <Link to={"/sign-up"} className="text-primary-500 text-bold">
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </Form>
      )}
    </>
  );
};

export default SignInForm;
