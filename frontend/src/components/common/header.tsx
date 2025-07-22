interface HeaderProps {
  title: string;
  description?: string;
}

const Header = ({ title, description }: HeaderProps) => {
  return (
    <div className="gap-3 flex flex-col">
      <div className="font-bold text-lg">{title}</div>
      <div className="text-muted-foreground">{description}</div>
    </div>
  );
};

export default Header;
