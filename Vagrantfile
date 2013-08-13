# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
	
	config.vm.define "main" do |node|

		# Ubuntu 12.04 LTS 'Precise Pangolin'
		node.vm.box = "precise32"
		node.vm.box_url = "http://files.vagrantup.com/precise32.box"

		# node.vm.hostname = "my host"

		node.vm.provider :virtualbox do |vb|
			vb.customize [
				"modifyvm", :id,
				"--memory", "512",
				"--cpus", "1",
			]
		end

		node.vm.provision :chef_solo do |chef|
			# chef.log_level = :debug
			chef.cookbooks_path = "cookbooks"

			chef.add_recipe "main"

			chef.json = {
				"nodejs" => {
					"version" => "0.8",
					"install_method" => "package"
				}
			}
		end
	end
end
