-- =========================================================
-- GROWVEST INSTITUTIONAL INVESTMENT PLATFORM
-- Production Supabase Schema, RLS Policies & Atomic RPCs
-- =========================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums / Check Constraints
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('user', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE deposit_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE withdrawal_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE investment_status AS ENUM ('active', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. Create 'profiles' Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL DEFAULT '',
    email TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    balance NUMERIC NOT NULL DEFAULT 0.00 CHECK (balance >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Create 'deposits' Table
CREATE TABLE IF NOT EXISTS public.deposits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    method TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    proof_url TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Create 'withdrawals' Table
CREATE TABLE IF NOT EXISTS public.withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    wallet_address TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Create 'investments' Table
CREATE TABLE IF NOT EXISTS public.investments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    plan_name TEXT NOT NULL,
    amount NUMERIC NOT NULL CHECK (amount > 0),
    roi_percent NUMERIC NOT NULL DEFAULT 0,
    start_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    end_date TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================================================
-- 7. HELPER FUNCTIONS & RLS POLICIES
-- =========================================================

-- Helper to check if caller is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deposits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------
-- Profiles Policies
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own profile or admin views all" ON public.profiles;
CREATE POLICY "Users can view own profile or admin views all"
ON public.profiles FOR SELECT
USING (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update their own profile or admin updates all" ON public.profiles;
CREATE POLICY "Users can update their own profile or admin updates all"
ON public.profiles FOR UPDATE
USING (auth.uid() = id OR public.is_admin())
WITH CHECK (auth.uid() = id OR public.is_admin());

-- ---------------------------------------------------------
-- Deposits Policies
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own deposits or admin views all" ON public.deposits;
CREATE POLICY "Users can view own deposits or admin views all"
ON public.deposits FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can create deposits" ON public.deposits;
CREATE POLICY "Users can create deposits"
ON public.deposits FOR INSERT
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update deposits" ON public.deposits;
CREATE POLICY "Admins can update deposits"
ON public.deposits FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ---------------------------------------------------------
-- Withdrawals Policies
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own withdrawals or admin views all" ON public.withdrawals;
CREATE POLICY "Users can view own withdrawals or admin views all"
ON public.withdrawals FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can request withdrawals" ON public.withdrawals;
CREATE POLICY "Users can request withdrawals"
ON public.withdrawals FOR INSERT
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update withdrawals" ON public.withdrawals;
CREATE POLICY "Admins can update withdrawals"
ON public.withdrawals FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- ---------------------------------------------------------
-- Investments Policies
-- ---------------------------------------------------------
DROP POLICY IF EXISTS "Users can view own investments or admin views all" ON public.investments;
CREATE POLICY "Users can view own investments or admin views all"
ON public.investments FOR SELECT
USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Users can create investments" ON public.investments;
CREATE POLICY "Users can create investments"
ON public.investments FOR INSERT
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Admins can update investments" ON public.investments;
CREATE POLICY "Admins can update investments"
ON public.investments FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =========================================================
-- 8. AUTOMATIC AUTH TRIGGER
-- Automatically creates a profile row when a user signs up
-- =========================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_role TEXT := 'user';
    v_name TEXT;
BEGIN
    -- If email matches admin address, grant admin role automatically
    IF NEW.email = 'admin@growvest.com' OR NEW.raw_user_meta_data->>'role' = 'admin' THEN
        v_role := 'admin';
    END IF;

    v_name := COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1));

    INSERT INTO public.profiles (id, full_name, email, role, balance, created_at)
    VALUES (
        NEW.id,
        v_name,
        NEW.email,
        v_role,
        0.00,
        NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        full_name = CASE WHEN profiles.full_name = '' THEN EXCLUDED.full_name ELSE profiles.full_name END;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =========================================================
-- 9. ATOMIC RPC BALANCE UPDATE FUNCTIONS (Avoiding race conditions)
-- =========================================================

-- RPC 1: Approve Deposit
-- Sets deposit status to 'approved' and adds amount to user profile balance atomically
CREATE OR REPLACE FUNCTION public.approve_deposit(deposit_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_deposit RECORD;
    v_new_balance NUMERIC;
BEGIN
    -- Check admin privileges
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can approve deposits.';
    END IF;

    -- Fetch and lock deposit row
    SELECT * INTO v_deposit
    FROM public.deposits
    WHERE id = deposit_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Deposit record not found.';
    END IF;

    IF v_deposit.status <> 'pending' THEN
        RAISE EXCEPTION 'Deposit has already been processed with status: %', v_deposit.status;
    END IF;

    -- Update deposit status
    UPDATE public.deposits
    SET status = 'approved'
    WHERE id = deposit_id;

    -- Atomically increment user balance
    UPDATE public.profiles
    SET balance = balance + v_deposit.amount
    WHERE id = v_deposit.user_id
    RETURNING balance INTO v_new_balance;

    RETURN jsonb_build_object(
        'success', true,
        'deposit_id', deposit_id,
        'new_balance', v_new_balance,
        'amount_added', v_deposit.amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 2: Reject Deposit
CREATE OR REPLACE FUNCTION public.reject_deposit(deposit_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_deposit RECORD;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can reject deposits.';
    END IF;

    SELECT * INTO v_deposit
    FROM public.deposits
    WHERE id = deposit_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Deposit record not found.';
    END IF;

    IF v_deposit.status <> 'pending' THEN
        RAISE EXCEPTION 'Deposit has already been processed with status: %', v_deposit.status;
    END IF;

    UPDATE public.deposits
    SET status = 'rejected'
    WHERE id = deposit_id;

    RETURN jsonb_build_object('success', true, 'deposit_id', deposit_id, 'status', 'rejected');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 3: Approve Withdrawal
-- Sets withdrawal status to 'approved' and subtracts amount from user profile balance atomically
CREATE OR REPLACE FUNCTION public.approve_withdrawal(withdrawal_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_withdrawal RECORD;
    v_current_balance NUMERIC;
    v_new_balance NUMERIC;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can approve withdrawals.';
    END IF;

    SELECT * INTO v_withdrawal
    FROM public.withdrawals
    WHERE id = withdrawal_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Withdrawal record not found.';
    END IF;

    IF v_withdrawal.status <> 'pending' THEN
        RAISE EXCEPTION 'Withdrawal has already been processed with status: %', v_withdrawal.status;
    END IF;

    -- Lock profile and check balance
    SELECT balance INTO v_current_balance
    FROM public.profiles
    WHERE id = v_withdrawal.user_id
    FOR UPDATE;

    IF v_current_balance < v_withdrawal.amount THEN
        RAISE EXCEPTION 'Insufficient user balance for withdrawal. Balance: %, Requested: %', v_current_balance, v_withdrawal.amount;
    END IF;

    -- Update withdrawal status
    UPDATE public.withdrawals
    SET status = 'approved'
    WHERE id = withdrawal_id;

    -- Atomically decrement balance
    UPDATE public.profiles
    SET balance = balance - v_withdrawal.amount
    WHERE id = v_withdrawal.user_id
    RETURNING balance INTO v_new_balance;

    RETURN jsonb_build_object(
        'success', true,
        'withdrawal_id', withdrawal_id,
        'new_balance', v_new_balance,
        'amount_deducted', v_withdrawal.amount
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 4: Reject Withdrawal
CREATE OR REPLACE FUNCTION public.reject_withdrawal(withdrawal_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_withdrawal RECORD;
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Unauthorized: Only admins can reject withdrawals.';
    END IF;

    SELECT * INTO v_withdrawal
    FROM public.withdrawals
    WHERE id = withdrawal_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Withdrawal record not found.';
    END IF;

    IF v_withdrawal.status <> 'pending' THEN
        RAISE EXCEPTION 'Withdrawal has already been processed with status: %', v_withdrawal.status;
    END IF;

    UPDATE public.withdrawals
    SET status = 'rejected'
    WHERE id = withdrawal_id;

    RETURN jsonb_build_object('success', true, 'withdrawal_id', withdrawal_id, 'status', 'rejected');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC 5: Create Investment & Deduct Balance
CREATE OR REPLACE FUNCTION public.create_investment(
    p_plan_name TEXT,
    p_amount NUMERIC,
    p_roi_percent NUMERIC,
    p_end_date TIMESTAMPTZ
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID := auth.uid();
    v_current_balance NUMERIC;
    v_new_balance NUMERIC;
    v_investment_id UUID;
BEGIN
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'User not authenticated.';
    END IF;

    IF p_amount <= 0 THEN
        RAISE EXCEPTION 'Investment amount must be greater than zero.';
    END IF;

    -- Lock profile and check balance
    SELECT balance INTO v_current_balance
    FROM public.profiles
    WHERE id = v_user_id
    FOR UPDATE;

    IF v_current_balance < p_amount THEN
        RAISE EXCEPTION 'Insufficient balance. Available: %, Required: %', v_current_balance, p_amount;
    END IF;

    -- Deduct balance
    UPDATE public.profiles
    SET balance = balance - p_amount
    WHERE id = v_user_id
    RETURNING balance INTO v_new_balance;

    -- Insert investment
    INSERT INTO public.investments (
        user_id,
        plan_name,
        amount,
        roi_percent,
        start_date,
        end_date,
        status
    )
    VALUES (
        v_user_id,
        p_plan_name,
        p_amount,
        p_roi_percent,
        NOW(),
        p_end_date,
        'active'
    )
    RETURNING id INTO v_investment_id;

    RETURN jsonb_build_object(
        'success', true,
        'investment_id', v_investment_id,
        'new_balance', v_new_balance
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
