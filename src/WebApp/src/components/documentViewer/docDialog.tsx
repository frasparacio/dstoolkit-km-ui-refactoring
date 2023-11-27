import {
    Button,
    Dialog,
    DialogBody,
    DialogContent,
    DialogSurface,
    DialogTitle,
    DialogTrigger,
    Divider,
    Tab,
    TabList,
    TabListProps,
    Text,
    makeStyles,
    shorthands,
} from "@fluentui/react-components";
import { Dismiss24Regular } from "@fluentui/react-icons";

const useStyles = makeStyles({
    dialog: {
        maxWidth: "fit-content",
        width: "70vw",
        "@media (max-width: 780px)": {
            // adjust width to your needs
            width: "90vw",
            backgroundColor: "red", // red color only to show when it changes
        },
        ...shorthands.borderRadius("1rem"),
    },
    tabList: {
        alignItems: "flex-start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        ...shorthands.padding("10px", "0px"),
        rowGap: "20px",
    },
});

interface DocDialogProps {}

export function DocDialog(props: Partial<TabListProps>) {
    const styles = useStyles();

    return (
        <Dialog>
            <DialogTrigger disableButtonEnhancement>
                <Button>See More</Button>
            </DialogTrigger>
            <DialogSurface className={styles.dialog}>
                <DialogBody className="">
                    <DialogTitle
                        action={
                            <DialogTrigger action="close">
                                <Button appearance="subtle" aria-label="close" icon={<Dismiss24Regular />} />
                            </DialogTrigger>
                        }
                    >
                        Dialog title
                        <div>
                            <Text size={200}>Date subtitle here</Text>
                        </div>
                        <div className="flex justify-between">
                            <div className={styles.tabList}>
                                <TabList {...props}>
                                    <Tab value="tab1">Document</Tab>
                                    <Tab value="tab2">Tab2</Tab>
                                    <Tab value="tab3">Tab3</Tab>
                                </TabList>
                            </div>
                            <Button className="h-8" appearance="primary">
                                Download
                            </Button>
                        </div>
                        <div className="pb-4">
                            <Divider />
                        </div>
                    </DialogTitle>

                    <div className="flex w-full justify-between" style={{ width: "200%" }}>
                        <div className="mr-5 w-full flex-grow-0 border border-green-400" style={{ width: "450%" }}>
                            pdf viewer
                        </div>
                        <DialogContent className="">
                            <div className="flex justify-between mb-4 ">
                                <Text size={400} weight="semibold">
                                    Extractive Summary
                                </Text>
                            </div>
                            <div className="flex mb-4">
                                <Text size={200} weight="regular">
                                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid, explicabo
                                    repudiandae impedit doloribus laborum quidem maxime dolores perspiciatis non ipsam,
                                    nostrum commodi quis autem sequi, incidunt cum? Consequuntur, repellendus nostrum?
                                </Text>
                            </div>
                        </DialogContent>
                    </div>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
}
