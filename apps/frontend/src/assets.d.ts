declare module "*.svg" {
  const src: string;
  export default src;
}
declare module "*.png" {
  const src: string;
  export default src;
}
declare module "*.jpg" {
  const src: string;
  export default src;
}
declare module "*.module.scss" {
  const classes: Record<string, string>;
  export default classes;
}
// Plain stylesheets are imported for their side effect only.
declare module "*.scss";
declare module "*.css";
