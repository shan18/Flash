import matplotlib.pyplot as plt


def plot_metric(data, metric, target_path, legend_loc='lower right'):
    """Plot accuracy graph or loss graph.

    Args:
        data (list or dict): If only single plot then this is a list, else
            for multiple plots this is a dict with keys containing.
            the plot name and values being a list of points to plot
        metric (str): Metric name which is to be plotted. Can be either
            loss or accuracy.
        legend_loc (str, optional): Location of the legend box in the plot.
            No legend will be plotted if there is only a single plot.
            (default: 'lower right')
    """

    single_plot = True
    if type(data) == dict:
        single_plot = False

    # Initialize a figure
    fig = plt.figure(figsize=(7, 5))

    # Plot data
    if single_plot:
        plt.plot(data)
    else:
        plots = []
        for value in data.values():
            plots.append(plt.plot(value)[0])

    # Set plot title
    plt.title(f'{metric} Change')

    # Label axes
    plt.xlabel('Epoch')
    plt.ylabel(metric)

    if not single_plot:  # Set legend
        plt.legend(
            tuple(plots), tuple(data.keys()),
            loc=legend_loc,
            shadow=True,
            prop={'size': 15}
        )

    # Save plot
    fig.savefig(target_path)
