/**
 * React Query hooks for auth endpoints (forgot/reset/change password, send-sms).
 */

import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import {
  forgotPassword as forgotPasswordApi,
  resetPassword as resetPasswordApi,
  changePassword as changePasswordApi,
  sendSms as sendSmsApi,
} from "@/apis/services/auth";
import type {
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SendSmsRequest,
  AuthApiResponse,
} from "@/apis/types/auth";

export function useForgotPassword(
  options?: UseMutationOptions<AuthApiResponse, Error, ForgotPasswordRequest>
) {
  return useMutation({
    mutationFn: forgotPasswordApi,
    ...options,
  });
}

export function useResetPassword(
  options?: UseMutationOptions<AuthApiResponse, Error, ResetPasswordRequest>
) {
  return useMutation({
    mutationFn: resetPasswordApi,
    ...options,
  });
}

export function useChangePassword(
  options?: UseMutationOptions<AuthApiResponse, Error, ChangePasswordRequest>
) {
  return useMutation({
    mutationFn: changePasswordApi,
    ...options,
  });
}

export function useSendSms(
  options?: UseMutationOptions<AuthApiResponse, Error, SendSmsRequest>
) {
  return useMutation({
    mutationFn: sendSmsApi,
    ...options,
  });
}
