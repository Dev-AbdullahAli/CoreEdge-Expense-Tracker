import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { groupId: string } }
) {
    const supabase = createRouteHandlerClient({ cookies })
    const { data } = await supabase
        .from('expenses')
        .select('*')
        .eq('group_id', params.groupId)
        .order('created_at', { ascending: false })

    return NextResponse.json({ data })
}

export async function POST(
    request: Request,
    { params }: { params: { groupId: string } }
) {
    const { description, amount } = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { error } = await supabase
        .from('expenses')
        .insert([{
            description,
            amount,
            group_id: params.groupId,
            user_id: user.id
        }])

    return NextResponse.json({ error })
}
