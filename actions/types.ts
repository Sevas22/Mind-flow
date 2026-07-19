export type FormState = {
  error?: string
  fieldErrors?: Record<string, string[]>
  success?: boolean
}

export const initialFormState: FormState = {}
