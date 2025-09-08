 interface IconsProps{
    size: "sm"  | "md" | "lg"
}

 const IconSizeVariants ={
    "sm": "size-2",
    "md": "size-4",
    "lg": "size-6",
}

export function CrossIcon(props:IconsProps){
         return(
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" 
            stroke="currentColor" className={IconSizeVariants[props.size]}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>

         )
}