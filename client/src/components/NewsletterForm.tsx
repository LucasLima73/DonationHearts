import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col space-y-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div className="relative">
                    <Input
                      placeholder="Seu melhor e-mail"
                      {...field}
                      className="bg-white/10 text-white border-0 pl-4 pr-4 py-6 focus-visible:ring-2 focus-visible:ring-white/30 rounded-md placeholder:text-white/50"
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-200 text-sm" />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            className="bg-white hover:bg-white/90 text-primary font-medium transition duration-200 py-6 rounded-md flex justify-center items-center btn-glow"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Processando..."
            ) : (
              <>
                Inscrever-se
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </Form>
    </motion.div>
  );
}
