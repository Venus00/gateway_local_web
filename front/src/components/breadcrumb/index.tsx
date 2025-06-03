import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useLanguage } from "@/context/language-context";

type PropsType = {
  links?: {
    url: string;
    name: string;
  }[];
  pageTitle?: string;
};
export default function BreadCrumb({ links = [], pageTitle }: PropsType) {
  const { t, isArabic } = useLanguage();

  return (
    <Breadcrumb dir={isArabic ? "rtl" : "ltr"} className="p-2">
      <BreadcrumbList>
        <BreadcrumbItem
          // className={` ${isArabic ? "order-4" : ""}`}
          dir={isArabic ? "rtl" : "ltr"}
        >
          <BreadcrumbLink href="/">{t("breadcrumb.home")}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator
          className={`${isArabic ? "rotate-180 " : ""}`}
          dir={isArabic ? "rtl" : "ltr"}
        />
        {links.map((link, index) => {
          return (
            <>
              <BreadcrumbItem
                key={index}
                // className={`  ${isArabic ? "order-2" : ""}`}
                dir={isArabic ? "rtl" : "ltr"}
              >
                <BreadcrumbLink className="capitalize" href={link.url}>
                  {link.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator
                className={`  ${isArabic ? "rotate-180" : ""}`}
                dir={isArabic ? "rtl" : "ltr"}
              />
            </>
          );
        })}
        {/* <BreadcrumbSeparator /> */}
        {pageTitle && (
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
          </BreadcrumbItem>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
