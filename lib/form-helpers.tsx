"use client"

import type { UseFormReturn } from "react-hook-form"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

interface BaseFieldProps {
  form: UseFormReturn<any>
  name: string
  label: string
  description?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export function TextField({ form, name, label, description, placeholder, disabled, required }: BaseFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input placeholder={placeholder} disabled={disabled} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function NumberField({ form, name, label, description, placeholder, disabled, required }: BaseFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function TextAreaField({ form, name, label, description, placeholder, disabled, required }: BaseFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Textarea placeholder={placeholder} disabled={disabled} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface SelectFieldProps extends BaseFieldProps {
  options: { label: string; value: string }[]
}

export function SelectField({
  form,
  name,
  label,
  description,
  placeholder = "Select an option",
  disabled,
  required,
  options,
}: SelectFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={disabled}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

interface CheckboxFieldProps extends Omit<BaseFieldProps, "placeholder"> {
  checkboxLabel?: string
}

export function CheckboxField({ form, name, label, description, disabled, checkboxLabel }: CheckboxFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{checkboxLabel || label}</FormLabel>
            {description && <FormDescription>{description}</FormDescription>}
          </div>
        </FormItem>
      )}
    />
  )
}

interface RadioFieldProps extends BaseFieldProps {
  options: { label: string; value: string; description?: string }[]
}

export function RadioField({ form, name, label, description, disabled, required, options }: RadioFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              disabled={disabled}
              className="flex flex-col space-y-1"
            >
              {options.map((option) => (
                <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={option.value} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="font-normal">{option.label}</FormLabel>
                    {option.description && <FormDescription>{option.description}</FormDescription>}
                  </div>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function DateField({ form, name, label, description, disabled, required }: BaseFieldProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input type="datetime-local" disabled={disabled} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

/**
 * Functional helpers that return JSX directly for inline usage
 * These are convenience wrappers around the component-based helpers
 */

interface CreateFieldOptions {
  description?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

interface CreateNumberFieldOptions extends CreateFieldOptions {
  min?: number
  max?: number
  step?: number
}

interface CreateDateFieldOptions extends CreateFieldOptions {
  disablePast?: boolean
  disableFuture?: boolean
}

export function createTextField(form: UseFormReturn<any>, name: string, label: string, options?: CreateFieldOptions) {
  return <TextField form={form} name={name} label={label} {...options} />
}

export function createNumberField(
  form: UseFormReturn<any>,
  name: string,
  label: string,
  options?: CreateNumberFieldOptions,
) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {options?.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="number"
              placeholder={options?.placeholder}
              disabled={options?.disabled}
              min={options?.min}
              max={options?.max}
              step={options?.step}
              {...field}
              onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
            />
          </FormControl>
          {options?.description && <FormDescription>{options.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export function createTextAreaField(
  form: UseFormReturn<any>,
  name: string,
  label: string,
  options?: CreateFieldOptions,
) {
  return <TextAreaField form={form} name={name} label={label} {...options} />
}

export function createSelectField(
  form: UseFormReturn<any>,
  name: string,
  label: string,
  selectOptions: { label: string; value: string }[],
  options?: CreateFieldOptions,
) {
  return <SelectField form={form} name={name} label={label} options={selectOptions} {...options} />
}

export function createCheckboxField(
  form: UseFormReturn<any>,
  name: string,
  label: string,
  options?: Omit<CreateFieldOptions, "placeholder">,
) {
  return <CheckboxField form={form} name={name} label={label} checkboxLabel={label} {...options} />
}

export function createRadioField(
  form: UseFormReturn<any>,
  name: string,
  label: string,
  radioOptions: { label: string; value: string; description?: string }[],
  options?: CreateFieldOptions,
) {
  return <RadioField form={form} name={name} label={label} options={radioOptions} {...options} />
}

export function createDateField(
  form: UseFormReturn<any>,
  name: string,
  label: string,
  options?: CreateDateFieldOptions,
) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {options?.required && <span className="text-destructive ml-1">*</span>}
          </FormLabel>
          <FormControl>
            <Input
              type="date"
              disabled={options?.disabled}
              min={options?.disablePast ? new Date().toISOString().split("T")[0] : undefined}
              max={options?.disableFuture ? new Date().toISOString().split("T")[0] : undefined}
              {...field}
              value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
              onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
            />
          </FormControl>
          {options?.description && <FormDescription>{options.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
