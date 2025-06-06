import { yupResolver } from '@hookform/resolvers/yup';
import {
  FieldValues,
  useForm,
  UseFormProps,
  UseFormReturn,
  type SubmitHandler,
} from 'react-hook-form';
import type { ObjectSchema } from 'yup';

type FormProps = {
  onSubmit: SubmitHandler<FieldValues>;
  children: (methods: UseFormReturn<FieldValues>) => React.ReactNode;
  useFormProps?: UseFormProps<FieldValues>;
  validationSchema?: ObjectSchema<FieldValues>;
} & Omit<React.FormHTMLAttributes<HTMLFormElement>, 'onSubmit'>;

export const Form = ({
  onSubmit,
  children,
  useFormProps,
  validationSchema,
  ...formProps
}: FormProps) => {
  const methods = useForm<FieldValues>({
    ...useFormProps,
    ...(validationSchema && { resolver: yupResolver(validationSchema) }),
  });
  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      noValidate
      {...formProps}
      className="space-y-4"
    >
      {children(methods)}
    </form>
  );
};
