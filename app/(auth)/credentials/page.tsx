import { signIn } from "@/lib/auth";

export default async function SignIn() {
  return (
    <form
      action={async (formdata) => {
        "use server";
        await signIn("credentials", formdata);
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
