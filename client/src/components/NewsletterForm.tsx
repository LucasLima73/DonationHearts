import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

const formSchema = z.object({
  email: z.string().email({ message: "E-mail inválido" }).min(1, {
    message: "E-mail é obrigatório",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      toast({
        title: "Inscrição realizada com sucesso!",
        description: "Obrigado por se inscrever em nossa newsletter.",
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Seu e-mail"
                    {...field}
                    className="bg-gray-700 text-white border-0 focus:ring-2 focus:ring-secondary"
                  />
                </FormControl>
                <FormMessage className="text-red-300" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="bg-secondary text-white hover:bg-secondary/90 font-medium transition duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Inscrevendo..." : "Inscrever-se"}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
