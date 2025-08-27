-- Configuração da base de dados RiderForge - VERSÃO SEGURA
-- Execute este script no SQL Editor do Supabase
-- Esta versão não contém operações destrutivas

-- 1. Criar tabela de perfis de utilizador
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Criar tabela de riders
CREATE TABLE IF NOT EXISTS riders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Criar tabela de subscrições
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'inactive',
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_riders_user_id ON riders(user_id);
CREATE INDEX IF NOT EXISTS idx_riders_created_at ON riders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- 5. Configurar Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE riders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- 6. Criar políticas de segurança para profiles
CREATE POLICY IF NOT EXISTS "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- 7. Criar políticas de segurança para riders
CREATE POLICY IF NOT EXISTS "Users can view own riders" ON riders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own riders" ON riders
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own riders" ON riders
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own riders" ON riders
  FOR DELETE USING (auth.uid() = user_id);

-- 8. Criar políticas de segurança para subscriptions
CREATE POLICY IF NOT EXISTS "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own subscription" ON subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own subscription" ON subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- 9. Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 10. Criar triggers para atualizar updated_at (versão segura)
DO $$
BEGIN
  -- Trigger para profiles
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_profiles_updated_at') THEN
    CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Trigger para riders
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_riders_updated_at') THEN
    CREATE TRIGGER update_riders_updated_at BEFORE UPDATE ON riders
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
  
  -- Trigger para subscriptions
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_subscriptions_updated_at') THEN
    CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 11. Criar função para criar perfil automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Criar trigger para criar perfil automaticamente (versão segura)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 13. Configurar storage para PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('riders', 'riders', true)
ON CONFLICT (id) DO NOTHING;

-- 14. Criar política de storage para riders
CREATE POLICY IF NOT EXISTS "Users can upload own riders" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'riders' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY IF NOT EXISTS "Users can view own riders" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'riders' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY IF NOT EXISTS "Users can update own riders" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'riders' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY IF NOT EXISTS "Users can delete own riders" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'riders' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- 15. Criar tabela de bug reports
CREATE TABLE IF NOT EXISTS bug_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  browser_info JSONB,
  app_version TEXT,
  page_url TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 16. Criar índices para bug reports
CREATE INDEX IF NOT EXISTS idx_bug_reports_user_id ON bug_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_bug_reports_status ON bug_reports(status);
CREATE INDEX IF NOT EXISTS idx_bug_reports_severity ON bug_reports(severity);
CREATE INDEX IF NOT EXISTS idx_bug_reports_created_at ON bug_reports(created_at DESC);

-- 17. Configurar RLS para bug reports
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- 18. Criar políticas de segurança para bug reports
-- Users podem criar bug reports (mesmo sem estar logados, mas se estiverem logados, o user_id será guardado)
CREATE POLICY IF NOT EXISTS "Anyone can create bug reports" ON bug_reports
  FOR INSERT WITH CHECK (true);

-- Users logados podem ver os seus próprios bug reports
CREATE POLICY IF NOT EXISTS "Users can view own bug reports" ON bug_reports
  FOR SELECT USING (auth.uid() = user_id);

-- Users logados podem atualizar os seus próprios bug reports
CREATE POLICY IF NOT EXISTS "Users can update own bug reports" ON bug_reports
  FOR UPDATE USING (auth.uid() = user_id);

-- 19. Criar trigger para atualizar updated_at em bug reports (versão segura)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_bug_reports_updated_at') THEN
    CREATE TRIGGER update_bug_reports_updated_at BEFORE UPDATE ON bug_reports
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
