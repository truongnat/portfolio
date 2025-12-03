import { supabase } from "@/lib/supabase";

const register = async () => {
    const { error, data } = await supabase.auth.signUp({
        email: 'truongdq.dev@gmail.com',
        password: '123456'
    });
    console.log('result:', error, data);
};

await register()