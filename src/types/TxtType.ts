export type TxtProps = {
    type: "title1" | "title2" | "title3" |"title4"| "body1" | "body2" | "body3" | "body4" | "button" | "recording" | "caption1" ;
    content: string;
    color?: string;
    align?:'left'|'center'|'right'
}