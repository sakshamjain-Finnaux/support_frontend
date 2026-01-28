import background from "../../assets/backgrounds/sssurf.svg";
import { Link } from "react-router-dom";
import Button from "../../components/ui/button/Button";
export default function NotFound() {
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
      }}
      className="flex min-h-screen items-center justify-center bg-center bg-cover bg-no-repeat"
    >
      <div className="max-w-screen-xl">
        <div className="max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-text-dark">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-text md:text-4xl">
            Something's missing.
          </p>
          <p className="mb-4 text-lg font-light text-text-light">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p>
          <Link to="/" replace={true}>
            <Button className="!px-5 !py-2.5 text-sm">Back to Homepage</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
