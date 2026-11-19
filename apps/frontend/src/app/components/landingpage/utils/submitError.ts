/** The server's message when it has one (e.g. log in again), otherwise a general one. */
export function submitErrorMessage(error: unknown): string {
  const response = (error as { response?: { status?: number; data?: { message?: unknown } } })
    ?.response;
  if (response?.status === 401) return "GitHub-innloggingen er utløpt. Logg ut og inn igjen.";
  if (response?.status === 403 && typeof response.data?.message === "string")
    return response.data.message.includes("disabled")
      ? "Innsending er slått av i dette miljøet."
      : response.data.message;
  if (typeof response?.data?.message === "string" && response.status && response.status < 500)
    return response.data.message;
  if (typeof response?.data?.message === "string" && response.status === 502)
    return response.data.message;
  return "Innsendingen feilet. Prøv igjen litt senere.";
}
