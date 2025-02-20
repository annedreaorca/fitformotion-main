

type PageHeadingProps = {
  title: string;
  id?: string;
};

export default function PageHeading({ title, id }: PageHeadingProps) {
  return ( <h1 className="text-2xl md:text-4xl font-semibold page-headings">{title}</h1> );
}