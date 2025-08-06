import { AppRoutes } from "@/routes/AppRoutes";
import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center gap-2">
      <h1 className="text-[32px]">404</h1>
      <p>Запрашиваемая страница не найдена</p>
      <Link to={AppRoutes.Main} className="text-blue-key">
        На главную
      </Link>
    </div>
  );
}
