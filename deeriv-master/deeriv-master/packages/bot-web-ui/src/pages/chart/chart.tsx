import React, { useState } from 'react';
import classNames from 'classnames';
import { observer, useStore } from '@deriv/stores';
import { useDBotStore } from 'Stores/useDBotStore';
import ToolbarWidgets from './toolbar-widgets';
import { ChartTitle, SmartChart } from './v1';

const Chart = observer(({ show_digits_stats }: { show_digits_stats: boolean }) => {
    const [isIframeVisible, setIsIframeVisible] = useState(false); // State to toggle iframe
    const barriers: [] = [];
    const { common, ui } = useStore();
    const { chart_store, run_panel, dashboard } = useDBotStore();

    const {
        chart_type,
        getMarketsOrder,
        granularity,
        onSymbolChange,
        setChartStatus,
        symbol,
        updateChartType,
        updateGranularity,
        wsForget,
        wsForgetStream,
        wsSendRequest,
        wsSubscribe,
    } = chart_store;
    const {
        ui: { is_desktop, is_mobile },
    } = useStore();
    const { is_drawer_open } = run_panel;
    const { is_chart_modal_visible } = dashboard;
    const is_socket_opened = common.is_socket_opened;
    const settings = {
        assetInformation: false,
        countdown: true,
        isHighestLowestMarkerEnabled: false,
        language: common.current_language.toLowerCase(),
        position: ui.is_chart_layout_default ? 'bottom' : 'left',
        theme: ui.is_dark_mode_on ? 'dark' : 'light',
    };

    const toggleView = () => setIsIframeVisible(!isIframeVisible); // Toggle function

    return (
        <div
            className={classNames('dashboard__chart-wrapper', {
                'dashboard__chart-wrapper--expanded': is_drawer_open && is_desktop,
                'dashboard__chart-wrapper--modal': is_chart_modal_visible && is_desktop,
            })}
            dir='ltr'
        >
            {/* Floating Toggle Button */}
            <button
                onClick={toggleView}
                style={{
                    position: 'absolute',
                    top: '5px',
                    right: '15px',
                    zIndex: 1000,
                    padding: '10px 20px',
                    borderRadius: '5px',
                    backgroundColor: '#007bff',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                }}
            >
                {isIframeVisible ? 'Show Chart' : 'Show Denara'}
            </button>

            {/* Conditional Rendering for Chart or iFrame */}
            {isIframeVisible ? (
                <iframe
                    src='https://denara.vercel.app' // Replace with your iframe URL
                    title='Iframe'
                    style={{ width: '100%', height: '100%', border: 'none' }}
                />
            ) : (
                <SmartChart
                    id='dbot'
                    barriers={barriers}
                    showLastDigitStats={show_digits_stats}
                    chartControlsWidgets={null}
                    enabledChartFooter={false}
                    chartStatusListener={(v: boolean) => setChartStatus(!v)}
                    toolbarWidget={() => (
                        <ToolbarWidgets
                            updateChartType={updateChartType}
                            updateGranularity={updateGranularity}
                            position={is_desktop ? null : 'bottom'}
                        />
                    )}
                    chartType={chart_type}
                    isMobile={is_mobile}
                    enabledNavigationWidget={is_desktop}
                    granularity={granularity}
                    requestAPI={wsSendRequest}
                    requestForget={wsForget}
                    requestForgetStream={wsForgetStream}
                    requestSubscribe={wsSubscribe}
                    settings={settings}
                    symbol={symbol}
                    topWidgets={() => <ChartTitle onChange={onSymbolChange} />}
                    isConnectionOpened={is_socket_opened}
                    getMarketsOrder={getMarketsOrder}
                    isLive
                    leftMargin={80}
                />
            )}
        </div>
    );
});

export default Chart;
