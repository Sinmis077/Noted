const store =
	{
		subscribe: (subscription: (value: any) => void) => (() => void),
		set?: (value: any) => void
	}