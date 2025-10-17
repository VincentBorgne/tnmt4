import classNames from 'classnames';

type Props = {
  nationality?: string | null;
};

export default function Flag({ nationality }: Props) {
  return <span className={classNames(`fi fi-${nationality}`, 'w-8')} />;
}
