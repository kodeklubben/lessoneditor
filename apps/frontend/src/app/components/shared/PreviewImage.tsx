import { CSSProperties, FC } from "react";
import { Icon, Image } from "semantic-ui-react";

/**
 * A lesson's thumbnail, or a neutral picture while it has none: a new or just copied lesson gets
 * its first thumbnail only after it has been opened in the editor.
 */
const PreviewImage: FC<{ src?: string; className?: string; style?: CSSProperties }> = ({
  src,
  className,
  style,
}) =>
  src ? (
    <Image className={className} style={style} src={src} alt="" bordered rounded />
  ) : (
    <div
      className={className}
      style={{
        ...style,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f3f4f5",
        borderRadius: 0,
      }}
      aria-hidden="true"
      data-testid="no-preview"
    >
      <Icon name="image outline" size="big" color="grey" />
    </div>
  );

export default PreviewImage;

/** A real thumbnail, not the one-byte placeholder a lesson starts with (base64 "IA=="). */
export const isPreviewImage = (base64: unknown): base64 is string =>
  typeof base64 === "string" && base64.length > 100;
