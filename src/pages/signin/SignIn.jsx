import { useState } from "react";
import { useForm } from "react-hook-form";
import background from "../../assets/backgrounds/sssurf.svg";
import useAuth from "../../contexts/AuthContext";
import {
  InputField,
  PasswordField,
} from "../../components/form_elements/FormFields";
import Button from "../../components/ui/button/Button";
// import { UncontrolledCheckBox } from "../../components/form_elements/UnControlledFields";

export default function SignIn() {
  const { signin } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: "onSubmit" });

  const onSubmit = async (data) => {
    if (submitting) return;
    setSubmitting(true);
    await signin(data);
    setSubmitting(false);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
      }}
      className="bg-cover bg-center flex flex-col w-full min-h-screen justify-center items-center gap-8 p-4">
      <div className="bg-body-940 flex flex-col justify-center items-start w-full ms:w-[28rem] rounded-lg shadow-md p-7 gap-2 font-medium bg-opacity-50">
        <div className="font-['Lora'] text-text-dark text-2xl">
          Support Panel
        </div>
        <p className="text-text-light mb-3">
          Enter your credentials to access the dashboard.
        </p>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col gap-4 text-sm">
          <InputField
            type="text"
            title={"Username"}
            placeholder="Your username"
            errors={errors}
            name={"username"}
            register={register}
            validationSchema={{
              required: "Username is required!",
              validate: {
                notEmpty: (value) => !!value.trim() || "Username is required!",
              },
            }}
          />

          <PasswordField
            errors={errors}
            name={"password"}
            title={"Password"}
            placeholder={"Your Password"}
            register={register}
            validationSchema={{
              required: "Password is required!",
              validate: {
                notEmpty: (value) => !!value.trim() || "Password is required!",
              },
            }}
          />

          {/* <div className="flex justify-between w-full gap-4 flex-wrap">

            <div className="flex items-center justify-center">
              <UncontrolledCheckBox />
              <div className="text-text-dark ml-2">Remember me</div>
            </div>

            <div className="underline text-text-light cursor-pointer hover:text-gray-600">Forgot password?</div>
          </div> */}

          <Button
            disabled={submitting}
            type="submit"
            className="!py-2 disabled:animate-pulse">
            Sign in
          </Button>
        </form>
      </div>

      <div className="text-gray-500 font-medium">
        Powered by <span className="font-semibold">&nbsp;FINNAUX</span>
      </div>
    </div>
  );
}
