import KebabMenu from "./KebabMenu";

type PageHeadingProps = {
  title: string;
};

export default function PageHeading({ title }: PageHeadingProps) {
  return (
    <div className='flex justify-between'>
      <div>
        <h1 className="text-2xl md:text-4xl mb-6 font-semibold page-headings">{title}</h1>
      </div>
      <div>
        <KebabMenu/>
      </div>
    </div>
  );
}