import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

import { cn } from "@/lib/utils";

const Breadcrumb = React.forwardRef(({ ...props }, ref) => (
  <nav ref={ref} aria-label="breadcrumb" {...props} />
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className,
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef(
  ({ asChild, className, ...props }, ref) => {
    const Comp = asChild ? Slot : "a";

    return (
      <Comp
        ref={ref}
        className={cn("transition-colors hover:text-foreground", className)}
        {...props}
      />
    );
  },
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({ children, className, ...props }) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:w-3.5 [&>svg]:h-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({ className, ...props }) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

// Custom Breadcrumbs component with your functionality
export default function Breadcrumbs() {
  const location = useLocation();
  let crumbs = location.pathname.split("/");
  if (crumbs[crumbs.length - 1] === "") crumbs.pop();

  const generateBreadcrumbs = () => {
    let items = [];
    let link_path = "/";

    // Home breadcrumb
    if (crumbs.length === 1) {
      items.push(
        <BreadcrumbItem key="home">
          <BreadcrumbLink asChild>
            <Link to={link_path} replace={true}>
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>,
      );
      return items;
    }

    items.push(
      <BreadcrumbItem key="home">
        <BreadcrumbLink asChild>
          <Link to={link_path} replace={true}>
            Home
          </Link>
        </BreadcrumbLink>
      </BreadcrumbItem>,
    );

    // Generate other breadcrumbs
    for (let i = 1; i < crumbs.length; i++) {
      let name = crumbs[i][0].toUpperCase() + crumbs[i].slice(1);
      link_path += crumbs[i] + "/";

      const isLast = i === crumbs.length - 1;

      items.push(<BreadcrumbSeparator key={`sep-${i}`} />);

      items.push(
        <BreadcrumbItem key={i}>
          {isLast ? (
            <BreadcrumbPage>{name}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink asChild>
              <Link to={link_path}>{name}</Link>
            </BreadcrumbLink>
          )}
        </BreadcrumbItem>,
      );
    }

    return items;
  };

  return (
    <nav className="flex bg-body-800 bg-opacity-5 select-none w-full px-4 md:px-8 p-1 border-b-2 border-body-800">
      <BreadcrumbList className="text-body-400">
        {generateBreadcrumbs()}
      </BreadcrumbList>
    </nav>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
