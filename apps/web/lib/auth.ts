"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { BACKEND_URL } from "./constants";
import { createSession, destroySession } from "./session";
import { FormState, SigninFormSchema, SignupFormSchema } from "./type";

export async function signUp(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validationFields = SignupFormSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validationFields.success) {
    return {
      ...state,
      error: z.flattenError(validationFields.error).fieldErrors,
    };
  }
  const response = await fetch(`${BACKEND_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: validationFields.data.name,
      email: validationFields.data.email,
      password: validationFields.data.password,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    return {
      ...state,
      success: true,
      message: "Signed up successfully",
    };
  }
  return {
    ...state,
    message: data.message,
  };
}

export async function signIn(
  state: FormState,
  formData: FormData,
): Promise<FormState> {
  const validationFields = SigninFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!validationFields.success) {
    return {
      ...state,
      error: z.flattenError(validationFields.error).fieldErrors,
    };
  }
  const response = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: validationFields.data.email,
      password: validationFields.data.password,
    }),
    credentials: "include",
  });
  const result = await response.json();
  if (response.ok) {
    //  create session for authenticated user
    await createSession({
      user: {
        id: result.id,
        name: result.name,
      },
    });
    return {
      ...state,
      success: true,
      message: "Signed in successfully",
    };
  }
  return {
    ...state,
    message: result.message ?? "Invalid email or password",
  };
}

export async function logOut() {
  await destroySession();

  revalidatePath("/", "layout");
  redirect("/");
}
