import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Breadcrumbs() {
    const location = useLocation();
    let crumbs = location.pathname.split("/");
    if (crumbs[crumbs.length - 1] === "") crumbs.pop();

    return (
        <nav className="flex bg-body-800 bg-opacity-5 select-none w-full px-4 md:px-8 p-1 border-b-2 border-body-800">
            <ol className="inline-flex items-center text-body-400">

                {
                    function () {
                        let map = [];
                        let link_path = "/";

                        if (crumbs.length === 1) {
                            map.push(
                                <Link key={0} to={link_path} replace={true}>
                                    <li className="inline-flex items-center">
                                        <span href="#" className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 cursor-pointer">
                                            Home
                                        </span>
                                    </li>
                                    <span className="mx-1">/</span>
                                </Link>
                            )
                            return map;
                        }

                        map.push(
                            <Link key={0} to={link_path} replace={true}>
                                <li className="inline-flex items-center">
                                    <span href="#" className="inline-flex items-center text-sm font-medium hover:text-primary-600 cursor-pointer">
                                        Home
                                    </span>
                                </li>
                                <span className="mx-1">/</span>
                            </Link>

                        )
                        for (let i = 1; i < crumbs.length; i++) {
                            let name = crumbs[i][0].toUpperCase() + crumbs[i].slice(1);
                            link_path += crumbs[i] + "/";
                            map.push(
                                <Link key={i} to={link_path}>
                                    <li className="inline-flex items-center">
                                        {
                                            i !== crumbs.length - 1 ? <span href="#" className="inline-flex items-center text-sm font-medium hover:text-primary-600 cursor-pointer">
                                                {name}
                                            </span> :

                                                <span href="#" className="inline-flex items-center text-sm font-medium text-primary-500 hover:text-primary-600 cursor-pointer">
                                                    {name}
                                                </span>
                                        }

                                    </li>
                                    <span className="mx-1">/</span>
                                </Link>
                            );
                        }
                        return map
                    }()

                }
            </ol>
        </nav>
    );
}