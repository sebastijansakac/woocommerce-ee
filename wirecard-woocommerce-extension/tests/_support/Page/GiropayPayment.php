<?php
/**
 * Shop System Plugins - Terms of Use
 *
 * The plugins offered are provided free of charge by Wirecard AG and are explicitly not part
 * of the Wirecard AG range of products and services.
 *
 * They have been tested and approved for full functionality in the standard configuration
 * (status on delivery) of the corresponding shop system. They are under General Public
 * License version 3 (GPLv3) and can be used, developed and passed on to third parties under
 * the same terms.
 *
 * However, Wirecard AG does not provide any guarantee or accept any liability for any errors
 * occurring when used in an enhanced, customized shop system configuration.
 *
 * Operation in an enhanced, customized configuration is at your own risk and requires a
 * comprehensive test phase by the user of the plugin.
 *
 * Customers use the plugins at their own risk. Wirecard AG does not guarantee their full
 * functionality neither does Wirecard AG assume liability for any disadvantages related to
 * the use of the plugins. Additionally, Wirecard AG does not guarantee the full functionality
 * for customized shop systems or installed plugins of other vendors of plugins within the same
 * shop system.
 *
 * Customers are responsible for testing the plugin's functionality before starting productive
 * operation.
 *
 * By installing the plugin into the shop system the customer agrees to these terms of use.
 * Please do not use the plugin if you do not agree to these terms of use!
 */

namespace Page;



class GiropayPayment extends Base {
	
	/**
	 * @var string
	 * @since 2.2.0
	 */
	public $URL = 'ShopSystem/bank/BankEntry';

	/**
	 * @var array
	 * @since 2.2.0
	 */
	public $elements = [
		'sc' 			=> "//input[@type='text' and @name='sc']",
		'extensionSc'   => "//input[@type='text' and @name='extensionSc']",
		'customerName1' => "//input[@type='text' and @name='customerName1']",
		'customerIBAN'  => "//input[@type='text' and @name='customerIBAN']",
		'Absenden' 		=> "//input[@type='submit']"
	];

	/**
	 * Method performGiropayPayment
	 * @since 2.2.0
	 */
	public function fillGiropayPaymentDetails()
	{
		$I = $this->tester;
		/** @var object $dataFields */
		$dataFields = $I->getDataFromDataFile( 'tests/_data/GiropayData.json' );
		$I->fillField($this->getElement( 'sc' ), $dataFields->sc);
		$I->fillField( $this->getElement( 'extensionSc' ), $dataFields->extensionSc );
	}
}
