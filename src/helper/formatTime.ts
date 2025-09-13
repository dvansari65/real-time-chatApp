

export const formatTime = (dateValue:string | Date | null | undefined)=>{
    try {
        const date = typeof dateValue == "string" ? new Date(dateValue) : dateValue;
        if(isNaN(date?.getTime() || 0) ){
            return ""
        }
        return date?.toLocaleDateString("en-US",{
            hour:"2-digit",
            minute:"2-digit",
            hour12:false
        })
    } catch (error) {
        console.error('Error formatting time:', error);
        return '';
    }
}